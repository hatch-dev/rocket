"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Select from "react-select";
import { getNames, getCode } from "country-list";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export type EmployeeRow = {
  id: number;
  firstname: string;
  lastname: string;
  profileImg: string | null;
  dob: Date | string | null;
  country: string | null;
  address: string | null;
  gender: string | null;
  email: string;
  phone: string;
  created_at: string | Date;
  updated_at: string | Date;
};

export function EmployeeModal({
  initial,
}: {
  initial?: EmployeeRow;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [countryOptions, setCountryOptions] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [phone, setPhone] = useState(initial?.phone || "");

  useEffect(() => {
    const options = getNames().map((country: string) => {
      const code = getCode(country);

      return {
        value: country,
        label: country,
        code: code,
      };
    });

    setCountryOptions(options);

    if (initial?.country) {
      const found = options.find(opt => opt.value === initial.country);
      setSelectedCountry(found || null);
    }

  }, [initial]);

  // For phone 
  useEffect(() => {
    if (initial?.phone && initial.phone.length > 5) {
      console.log("Setting full phone:", initial.phone);
      setPhone(initial.phone);
    } else {
      console.log("Phone invalid or too short:", initial?.phone);
      setPhone("");
    }
  }, [initial]);

  const selectedCountryCode = selectedCountry?.code?.toLowerCase();
  const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const fd = new FormData(e.currentTarget);

    const firstname = String(fd.get("firstname") || "").trim();
    const lastname = String(fd.get("lastname") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const phoneNumber = phone;
    const password = String(fd.get("password") || "");
    const dob = fd.get("dob");
    const gender = fd.get("gender");
    const address = fd.get("address");
    const country = selectedCountry?.value;
    const file = fd.get("file");

    if (!firstname || !lastname || !email) {
      setError("Firstname, lastname and email are required");
      return;
    }

    if (!initial?.id && !password) {
      setError("Password is required for new employee");
      return;
    }

    setLoading(true);

    try {
      let imagePath = null;

      if (file && typeof file === "object" && (file as File).size > 0) {
        const uploadData = new FormData();
        uploadData.append("file", file);
        uploadData.append("folder", "employees");

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });

        const uploadResult = await uploadRes.json();
        imagePath = uploadResult.path;

        console.log("Uploaded image:", imagePath);
      }

      const body = {
        firstname,
        lastname,
        email,
        phone: phoneNumber,
        password,
        dob,
        gender,
        address,
        country,
        profileImg: imagePath || initial?.profileImg,
      };

      console.log("Submitting body:", body);

      const url = initial?.id
        ? `/api/employees/${initial.id}`
        : `/api/employees`;

      const method = initial?.id ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log("API RESPONSE:", data);

      if (!res.ok) {
        setError(data.error || "Failed to save employee");
        return;
      }

      router.push("/rocket/admin/dashboard/employees");

    } catch (err) {
      console.log("Error:", err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Add Employee</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={onSubmit}>
        <div className="row">

          <div className="col-md-6 mb-3">
            <label>Profile Image</label>

            {initial?.profileImg && (
              <div className="mb-2">
                <img
                  src={initial.profileImg}
                  alt="Profile"
                  style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "6px" }}
                />
              </div>
            )}

            <input type="file" name="file" className="form-control" />
          </div>

          <div className="col-md-6 mb-3">
            <label>First Name</label>
            <input name="firstname" defaultValue={initial?.firstname || ""} className="form-control" required />
          </div>

          <div className="col-md-6 mb-3">
            <label>Last Name</label>
            <input name="lastname" defaultValue={initial?.lastname || ""} className="form-control" required />
          </div>

          <div className="col-md-6 mb-3">
            <label>Email</label>
            <input name="email" defaultValue={initial?.email || ""} type="email" className="form-control" required />
          </div>

          <div className="col-md-6 mb-3">
            <label>Country</label>

            <Select
              options={countryOptions}
              value={selectedCountry}
              onChange={(selected) => {
                setSelectedCountry(selected);
              }}
              placeholder="Select country"

              formatOptionLabel={(option: any) => (
                <div className="d-flex align-items-center gap-2">
                  <img
                    src={`https://flagcdn.com/w20/${option.code?.toLowerCase()}.png`}
                    alt={option.label}
                  />
                  {option.label}
                </div>
              )}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Phone</label>
            {/* <PhoneInput
          country={selectedCountryCode || "in"}
          value={phone}
          onChange={(value) => setPhone(value)}
          inputClass="form-control"
          inputProps={{
            name: "phone",
            required: true,
          }}
          containerClass="w-100"
          disableDropdown={true}
          countryCodeEditable={false}
        /> */}
            

          <PhoneInput
            country="ie"
            value={formattedPhone}
            onChange={(value) => setPhone(value.replace("+", ""))}
            inputClass="form-control"
            containerClass="w-100"
          />
        </div>

          <div className="col-md-6 mb-3">
            <label>DOB</label>
            <input type="date" name="dob" defaultValue={
              initial?.dob
                ? typeof initial.dob === "string"
                  ? initial.dob.slice(0, 10)
                  : initial.dob.toISOString().split("T")[0]
                : ""
            } className="form-control" />
          </div>

          <div className="col-md-6 mb-3">
            <label>Gender</label>
            <select name="gender" defaultValue={initial?.gender || ""} className="form-control">
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label>Address</label>
            <input name="address" defaultValue={initial?.address || ""} className="form-control" />
          </div>

          <div className="col-md-6 mb-3">
            <label>Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              placeholder={
                initial?.id
                  ? "Leave blank to keep current password"
                  : "Enter password"
              }
              required={!initial?.id}
            />
          </div>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => router.push("/rocket/admin/dashboard/employees")}
          >
            Cancel
          </button>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}