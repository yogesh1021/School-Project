'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddSchool() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const router = useRouter();

  const onSubmit = async (values) => {
    setSubmitting(true);
    setErrMsg('');

    try {
      const fd = new FormData();
      fd.append('name', values.name);
      fd.append('address', values.address);
      fd.append('city', values.city);
      fd.append('state', values.state);
      fd.append('contact', values.contact);
      fd.append('email_id', values.email_id);
      if (values.image?.[0]) fd.append('image', values.image[0]);

      const res = await fetch('/api/schools', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed');

      reset();
      router.push('/schools');
    } catch (e) {
      setErrMsg(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border rounded p-5">
        <div>
          <label className="block mb-1">School Name *</label>
          <input className="w-full border p-2 rounded"
            {...register('name', { required: 'Required' })}
            placeholder="ABC High School"
          />
          {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block mb-1">Address *</label>
          <input className="w-full border p-2 rounded"
            {...register('address', { required: 'Required' })}
            placeholder="Street, Area"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block mb-1">City *</label>
            <input className="w-full border p-2 rounded"
              {...register('city', { required: 'Required' })}
            />
          </div>
          <div>
            <label className="block mb-1">State *</label>
            <input className="w-full border p-2 rounded"
              {...register('state', { required: 'Required' })}
            />
          </div>
          <div>
            <label className="block mb-1">Contact (10 digits) *</label>
            <input className="w-full border p-2 rounded" maxLength={10}
              {...register('contact', {
                required: 'Required',
                pattern: { value: /^\d{10}$/, message: 'Enter 10 digits' }
              })}
            />
            {errors.contact && <p className="text-red-600 text-sm">{errors.contact.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block mb-1">Email *</label>
            <input className="w-full border p-2 rounded"
              {...register('email_id', {
                required: 'Required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' }
              })}
            />
            {errors.email_id && <p className="text-red-600 text-sm">{errors.email_id.message}</p>}
          </div>
          <div>
            <label className="block mb-1">Image *</label>
            <input type="file" accept="image/*" className="w-full"
              {...register('image', { required: 'Image is required' })}
            />
            {errors.image && <p className="text-red-600 text-sm">{errors.image.message}</p>}
          </div>
        </div>

        {errMsg && <p className="text-red-600">{errMsg}</p>}

        <button
          disabled={submitting}
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-60"
        >
          {submitting ? 'Saving…' : 'Save School'}
        </button>
      </form>
    </div>
  );
}
