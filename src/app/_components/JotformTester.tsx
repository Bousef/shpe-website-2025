"use client";

import { useState } from "react";

export default function JotFormSubmitter() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [recommend, setRecommend] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const API_KEY = process.env.NEXT_PUBLIC_JOTFORM_API_KEY!;
  const FORM_ID = process.env.NEXT_PUBLIC_JOTFORM_FORM_ID!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append("submission[3][first]", firstName);
    formData.append("submission[3][last]", lastName);
    formData.append("submission[5]", phone);
    formData.append("submission[6]", email);
    formData.append("submission[15]", recommend);

    const response = await fetch(
      `https://api.jotform.com/form/${FORM_ID}/submissions?apiKey=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      },
    );

    const data = await response.json();
    if (data?.responseCode === 200) {
      setSubmitted(true);
    } else {
      alert("Submission failed.");
      console.error("❌ Submission error:", data);
    }
  };

  if (submitted) return <p>✅ Form submitted successfully!</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          className="w-full border p-2"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          className="w-full border p-2"
        />
      </div>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-2"
        required
      />
      <input
        type="tel"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full border p-2"
        required
      />
      <select
        value={recommend}
        onChange={(e) => setRecommend(e.target.value)}
        required
        className="w-full border p-2"
      >
        <option value="">Would you recommend us?</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
        <option value="Maybe">Maybe</option>
      </select>

      <button
        type="submit"
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        Submit
      </button>
    </form>
  );
}
