"use client"

import { useState } from "react"
import type { z } from "zod"

export function useFormValidation<T extends z.ZodSchema>(schema: T) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (data: any): z.infer<T> | null => {
    try {
      const validatedData = schema.parse(data)
      setErrors({})
      return validatedData
    } catch (error: any) {
      if (error.errors) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err: any) => {
          newErrors[err.path[0]] = err.message
        })
        setErrors(newErrors)
      }
      return null
    }
  }

  const clearErrors = () => setErrors({})

  return { errors, validate, clearErrors }
}
