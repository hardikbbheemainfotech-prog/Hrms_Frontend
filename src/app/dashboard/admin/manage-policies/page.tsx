'use client';

import RoleGuard from '@/components/shared/RoleGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/axios';
import { useEffect, useState } from 'react';

export default function AddPolicyPage() {
  const [formData, setFormData] = useState({
    policy_key: '',
    policy_value: '',
    description: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const { toast } = useToast();
  const [policies, setpolicies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/admin/add_policy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

     if (response.ok) {
  const newPolicy = await response.json();

  setpolicies((prev) => [
  {
    ...formData,
    policy_key: `${formData.policy_key.trim().toUpperCase()}`,
  },
  ...prev,
]);

  setStatus("success");

  setFormData({
    policy_key: "",
    policy_value: "",
    description: "",
  });
} else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
    }
  };
  const fetchpolicies = async () => {
    try {
      setLoading(true);
      const res = await api.get("/core/policies")
      setpolicies(res.data?.data || [])
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Fetch fail" })
    } finally {
      setLoading(false);  
    }
  }

  useEffect(() => {
    fetchpolicies()
  }, [])


  return (
    <RoleGuard allowedRoles={['admin']}>
      
            <div className="bg-[#ACC8A2]/90 rounded-2xl p-6 overflow-x-auto shadow-lg p-6 space-y-6  flex flex-col">
               <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Manage Policies
                </h1>
                <p className="text-muted-foreground">
                  Define and manage organizational policies for enhanced security and compliance.
                </p>
              </div>
            </div>
            <div className="w-full mx-auto p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100 shadow-sm overflow-hidden no-scrollbar">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Policy Key</label>
          <Input
            type="text"
            name="policy_key"
            value={formData.policy_key}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="e.g., ESIC Policy"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Policy Value</label>
          <Input
            type="text"
            name="policy_value"
            value={formData.policy_value}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Requirement for the policy (e.g., Required, Optional)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Explain what this policy does..."
          />
        </div>

       <Button
  type="submit"
  disabled={
    status === "loading" ||
    !formData.policy_key.trim() ||
    !formData.policy_value.trim() ||
    !formData.description.trim()
  }
  className="w-full"
>
  {status === "loading" ? "Adding..." : "Add Policy"}
</Button>

        {status === 'success' && <p className="text-green-600">Policy added successfully!</p>}
        {status === 'error' && <p className="text-red-600">Failed to add policy. Try again.</p>}
      </form>
    </div>
   <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100 shadow-sm overflow-hidden no-scrollbar">
  <div className="w-full mx-auto p-6">
    <h2 className="text-2xl font-bold tracking-tight text-gray-700 mb-6">
      Existing Policies
    </h2>

    <div className="overflow-x-auto no-scrollbar">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50/50 border-b text-xs font-bold text-gray-700 uppercase tracking-wider">
          <tr>
            <th className="px-6 py-4 text-left">Policy Key</th>
            <th className="px-6 py-4 text-center">Policy Condition</th>
            <th className="px-6 py-4 text-left">Description</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-50">
          {policies.map((policy) => (
            <tr
              key={policy.policy_key}
              className="hover:bg-gray-50/30 transition-colors"
            >
              <td className="px-6 py-4">
                <span className="font-bold text-gray-700">
                  {policy.policy_key}
                </span>
              </td>

              <td className="px-6 py-4 text-center">
                <span className="font-semibold uppercase">
                  {policy.policy_value}
                </span>
              </td>

              <td className="px-6 py-4 text-left">
                <span className=" font-medium">
                  {policy.description}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {policies.length === 0 && (
        <div className="p-12 text-center text-gray-400">
          No policies available.
        </div>
      )}
    </div>
  </div>
</div>
    </div>
    </RoleGuard>
  );
}