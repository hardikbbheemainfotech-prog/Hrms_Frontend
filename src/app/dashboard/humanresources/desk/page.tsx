"use client"
import PoliciesPage from '../hr-components/getPolicies'
import MailComposer from '../hr-components/MailComposer'

const page = () => {
  return (
    <div className="flex flex-col gap-8 p-6">
      <section>
        <MailComposer />
      </section>

      <section>
        <PoliciesPage />
      </section>
    </div>
  )
}

export default page