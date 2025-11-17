import React, { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import {
  SupportActionConfig,
  SupportActionField,
} from "../../features/support/types";

type SupportActionFormProps = {
  action: SupportActionConfig;
  onSubmit: (payload: Record<string, string>) => void;
  onClose: () => void;
};

const buildInitialState = (action: SupportActionConfig) => {
  const initial: Record<string, string> = {};
  action.fields.forEach((field) => {
    if (field.type === "select" && field.options?.length) {
      initial[field.id] = field.options[0].value;
    } else {
      initial[field.id] = "";
    }
  });
  return initial;
};

export function SupportActionForm({
  action,
  onSubmit,
  onClose,
}: SupportActionFormProps) {
  const [formState, setFormState] = useState<Record<string, string>>(() =>
    buildInitialState(action)
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormState(buildInitialState(action));
    setError(null);
  }, [action]);

  const handleInputChange = (field: SupportActionField, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [field.id]: value,
    }));
  };

  const handleFileChange = (
    field: SupportActionField,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    handleInputChange(field, file ? file.name : "");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const missingField = action.fields.find(
      (field) => field.required && !formState[field.id]?.trim()
    );
    if (missingField) {
      setError(`لطفاً ${missingField.label} را تکمیل کنید.`);
      return;
    }

    setError(null);
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit(formState);
      setIsSubmitting(false);
      onClose();
    }, 250);
  };

  const renderField = (field: SupportActionField) => {
    const commonClasses =
      "w-full rounded-xl border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-right";

    if (field.type === "textarea") {
      return (
        <textarea
          id={field.id}
          rows={field.rows || 3}
          className={`${commonClasses} resize-none`}
          placeholder={field.placeholder}
          value={formState[field.id] || ""}
          onChange={(event) => handleInputChange(field, event.target.value)}
        />
      );
    }

    if (field.type === "select") {
      return (
        <select
          id={field.id}
          className={`${commonClasses} bg-white`}
          value={formState[field.id] || ""}
          onChange={(event) => handleInputChange(field, event.target.value)}
        >
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    if (field.type === "file") {
      return (
        <div className="space-y-2">
          <input
            id={field.id}
            type="file"
            className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700 hover:file:bg-blue-100"
            onChange={(event) => handleFileChange(field, event)}
          />
          {formState[field.id] && (
            <p className="text-[11px] text-gray-500">
              فایل انتخابی: {formState[field.id]}
            </p>
          )}
        </div>
      );
    }

    const inputType =
      field.type === "date" || field.type === "time" || field.type === "tel"
        ? field.type
        : "text";

    return (
      <input
        id={field.id}
        type={inputType}
        className={commonClasses}
        placeholder={field.placeholder}
        value={formState[field.id] || ""}
        onChange={(event) => handleInputChange(field, event.target.value)}
      />
    );
  };

  return (
    <form className="space-y-4 text-right" onSubmit={handleSubmit}>
      {(action.helper || action.sla) && (
        <div className="space-y-1">
          {action.helper && (
            <p className="text-xs text-gray-500 leading-5">{action.helper}</p>
          )}
          {action.sla && (
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1 text-[11px] text-gray-600 border border-gray-100">
              {action.sla}
            </span>
          )}
        </div>
      )}

      <div className="space-y-3">
        {action.fields.map((field) => (
          <div key={field.id} className="space-y-1.5">
            <label
              htmlFor={field.id}
              className="block text-sm font-medium text-gray-700"
            >
              {field.label}
              {field.required && (
                <span className="text-rose-500 mr-1 text-xs">*</span>
              )}
            </label>
            {renderField(field)}
          </div>
        ))}
      </div>

      {error && <p className="text-xs text-rose-500">{error}</p>}

      <div className="flex justify-end gap-2 flex-row-reverse pt-2">
        <Button variant="secondary" size="sm" type="button" onClick={onClose}>
          انصراف
        </Button>
        <Button variant="primary" size="sm" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "در حال ارسال..." : action.actionLabel}
        </Button>
      </div>
    </form>
  );
}
