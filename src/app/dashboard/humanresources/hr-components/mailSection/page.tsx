"use client"

import api from "@/lib/axios";
import { useEffect, useState } from "react";

type Employee = {
  employee_id: number;
  first_name: string;
  last_name: string;
  email: string;
};

type Interview = {
  interview_id: number;
  candidate_name: string;
  job_title: string;
};

export default function SendMail() {

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);

  const [loading, setLoading] = useState(false);

  const [recipientType, setRecipientType] =
    useState<"EMPLOYEE" | "CANDIDATE">(
      "CANDIDATE"
    );

  const [attachments, setAttachments] =
    useState<File[]>([]);

  const [form, setForm] = useState({
    employee_id: "",
    interview_id: "",
    template_key: "",
    custom_subject: "",
    custom_message: "",
  });



  // ===============================
  // FETCH EMPLOYEES
  // ===============================

  useEffect(() => {

    fetchEmployees();
    fetchInterviews();

  }, []);



  const fetchEmployees = async () => {

    try {

      const res = await api.get(
        "/core/employees"
      );

      setEmployees(res.data.data);

    } catch (error) {
      console.log(error);
    }
  };



  // ===============================
  // FETCH INTERVIEWS
  // ===============================

  const fetchInterviews = async () => {

    try {

      const res = await api.get(
        "/hr/interviews"
      );

      setInterviews(
        res.data.data.interviews
      );

    } catch (error) {
      console.log(error);
    }
  };



  // ===============================
  // CHANGE
  // ===============================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };



  // ===============================
  // SUBMIT
  // ===============================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      setLoading(true);

      const data = new FormData();

      data.append(
        "recipient_type",
        recipientType
      );

      data.append(
        "template_key",
        form.template_key
      );

      data.append(
        "employee_id",
        form.employee_id
      );

      data.append(
        "interview_id",
        form.interview_id
      );

      data.append(
        "custom_subject",
        form.custom_subject
      );

      data.append(
        "custom_message",
        form.custom_message
      );



      attachments.forEach((file) => {
        data.append(
          "attachments",
          file
        );
      });



      await api.post(
        "/api/mail/send",
        data,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      alert("Mail sent successfully");

    } catch (error) {

      console.log(error);

      alert("Failed to send mail");

    } finally {

      setLoading(false);
    }
  };



  return (

    <div className="min-h-screen bg-[#f5f5f5] p-8">

      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8">

        <h1 className="text-3xl font-semibold mb-8">
          Send Mail
        </h1>



        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* RECIPIENT TYPE */}

          <div>

            <label className="block mb-2 text-sm font-medium">
              Recipient Type
            </label>

            <select
              value={recipientType}
              onChange={(e) =>
                setRecipientType(
                  e.target.value as
                    | "EMPLOYEE"
                    | "CANDIDATE"
                )
              }
              className="w-full border rounded-lg p-3"
            >

              <option value="CANDIDATE">
                Candidate
              </option>

              <option value="EMPLOYEE">
                Employee
              </option>

            </select>

          </div>



          {/* EMPLOYEE */}

          {recipientType === "EMPLOYEE" && (

            <div>

              <label className="block mb-2 text-sm font-medium">
                Select Employee
              </label>

              <select
                name="employee_id"
                value={form.employee_id}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                required
              >

                <option value="">
                  Select Employee
                </option>

                {employees.map((emp) => (

                  <option
                    key={emp.employee_id}
                    value={emp.employee_id}
                  >
                    {emp.first_name}{" "}
                    {emp.last_name}
                  </option>
                ))}
              </select>

            </div>
          )}



          {/* INTERVIEW */}

          {recipientType === "CANDIDATE" && (

            <div>

              <label className="block mb-2 text-sm font-medium">
                Select Interview
              </label>

              <select
                name="interview_id"
                value={form.interview_id}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                required
              >

                <option value="">
                  Select Interview
                </option>

                {interviews.map((item) => (

                  <option
                    key={item.interview_id}
                    value={item.interview_id}
                  >
                    #{item.interview_id}
                    {" - "}
                    {item.candidate_name}
                    {" - "}
                    {item.job_title}
                  </option>
                ))}
              </select>

            </div>
          )}



          {/* TEMPLATE */}

          <div>

            <label className="block mb-2 text-sm font-medium">
              Template
            </label>

            <select
              name="template_key"
              value={form.template_key}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            >

              <option value="">
                Select Template
              </option>

              {/* candidate */}
              {recipientType ===
                "CANDIDATE" && (
                <>
                  <option value="INTERVIEW_INVITATION">
                    Interview Invitation
                  </option>

                  <option value="NEXT_ROUND_INVITATION">
                    Next Round Invitation
                  </option>

                  <option value="CANDIDATE_SELECTED">
                    Candidate Selected
                  </option>

                  <option value="CANDIDATE_REJECTION">
                    Candidate Rejection
                  </option>

                  <option value="OFFER_LETTER">
                    Offer Letter
                  </option>

                  <option value="JOINING_INSTRUCTIONS">
                    Joining Instructions
                  </option>
                </>
              )}



              {/* employee */}
              {recipientType ===
                "EMPLOYEE" && (
                <option value="GENERAL_EMPLOYEE_NOTIFICATION">
                  General Employee Notification
                </option>
              )}

            </select>

          </div>



          {/* CUSTOM SUBJECT */}

          <div>

            <label className="block mb-2 text-sm font-medium">
              Custom Subject
            </label>

            <input
              type="text"
              name="custom_subject"
              value={form.custom_subject}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              placeholder="Optional"
            />

          </div>



          {/* CUSTOM MESSAGE */}

          <div>

            <label className="block mb-2 text-sm font-medium">
              Custom Message
            </label>

            <textarea
              name="custom_message"
              value={form.custom_message}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 h-40"
              placeholder="Optional"
            />

          </div>



          {/* ATTACHMENTS */}

          <div>

            <label className="block mb-2 text-sm font-medium">
              Attachments
            </label>

            <input
              type="file"
              multiple
              onChange={(e) => {

                if (e.target.files) {

                  setAttachments(
                    Array.from(
                      e.target.files
                    )
                  );
                }
              }}
              className="w-full border rounded-lg p-3"
            />

          </div>



          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#5A0F2E] text-white px-6 py-3 rounded-lg"
          >

            {loading
              ? "Sending..."
              : "Send Mail"}

          </button>

        </form>

      </div>

    </div>
  );
}

