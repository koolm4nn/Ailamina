// File for custom errors

// 
export interface FormFieldError extends Error {
    field?: string,     // e.g. "id1" or "name", database field the error is related to
    code?: string       // e.g. "UNIQUE_CONSTRAINT"
}