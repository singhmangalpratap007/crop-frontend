"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { ResultCard } from "./result-card"
import { useLanguage } from "@/lib/i18n/context"

interface FormData {
  nitrogen: string
  phosphorus: string
  potassium: string
  temperature: string
  humidity: string
  ph: string
  rainfall: string
}

interface PredictionResult {
  crop: string
  confidence: number
  advisory: string
}

export function CropRecommendationForm() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState<FormData>({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  })

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const { toast } = useToast()

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}
    let isValid = true

    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key as keyof FormData] = t("form.required")
        isValid = false
      } else {
        const numValue = Number.parseFloat(value)
        if (isNaN(numValue)) {
          newErrors[key as keyof FormData] = t("form.invalidNumber")
          isValid = false
        }
        if (key === "humidity" && (numValue < 0 || numValue > 100)) {
          newErrors[key as keyof FormData] = t("form.humidityRange")
          isValid = false
        }
        if (key === "ph" && (numValue < 0 || numValue > 14)) {
          newErrors[key as keyof FormData] = t("form.phRange")
          isValid = false
        }
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: t("form.validationError"),
        description: t("form.validationErrorDesc"),
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nitrogen: Number.parseFloat(formData.nitrogen),
          phosphorus: Number.parseFloat(formData.phosphorus),
          potassium: Number.parseFloat(formData.potassium),
          temperature: Number.parseFloat(formData.temperature),
          humidity: Number.parseFloat(formData.humidity),
          ph: Number.parseFloat(formData.ph),
          rainfall: Number.parseFloat(formData.rainfall),
        }),
      })

      if (!response.ok) throw new Error("API request failed")

      const data = await response.json()
      setResult(data)

      toast({
        title: t("form.predictionSuccess"),
        description: t("form.predictionSuccessDesc"),
      })
    } catch {
      toast({
        title: t("form.predictionError"),
        description: t("form.predictionErrorDesc"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = () => {
    if (!result) return
    const content = `Smart Crop Recommendation\n\nDate: ${new Date().toLocaleDateString()}\n\nRecommended Crop: ${result.crop}\nConfidence Score: ${(result.confidence * 100).toFixed(1)}%\n\nAdvisory:\n${result.advisory}`
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `crop-recommendation-${new Date().getTime()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="w-full max-w-2xl space-y-8">
      <Card className="w-full shadow-lg">
        <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
          <CardTitle className="text-2xl">{t("form.title")}</CardTitle>
          <CardDescription className="text-primary-foreground/80">{t("form.description")}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Soil Nutrients */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-foreground">{t("form.soilNutrients")}</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <FormField label={t("form.nitrogen")} name="nitrogen" value={formData.nitrogen} onChange={handleChange} error={errors.nitrogen} placeholder={t("form.nitrogenPlaceholder")} />
                <FormField label={t("form.phosphorus")} name="phosphorus" value={formData.phosphorus} onChange={handleChange} error={errors.phosphorus} placeholder={t("form.phosphorusPlaceholder")} />
                <FormField label={t("form.potassium")} name="potassium" value={formData.potassium} onChange={handleChange} error={errors.potassium} placeholder={t("form.potassiumPlaceholder")} />
              </div>
            </div>

            {/* Weather Conditions */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-foreground">{t("form.weatherConditions")}</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <FormField label={t("form.temperature")} name="temperature" value={formData.temperature} onChange={handleChange} error={errors.temperature} placeholder={t("form.temperaturePlaceholder")} />
                <FormField label={t("form.humidity")} name="humidity" value={formData.humidity} onChange={handleChange} error={errors.humidity} placeholder={t("form.humidityPlaceholder")} />
                <FormField label={t("form.rainfall")} name="rainfall" value={formData.rainfall} onChange={handleChange} error={errors.rainfall} placeholder={t("form.rainfallPlaceholder")} />
              </div>
            </div>

            {/* Soil Properties */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-foreground">{t("form.soilProperties")}</h3>
              <FormField label={t("form.ph")} name="ph" value={formData.ph} onChange={handleChange} error={errors.ph} placeholder={t("form.phPlaceholder")} />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t("form.predicting")}
                </>
              ) : (
                t("form.predict")
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-10 duration-500">
          <ResultCard
            result={result}
            onReset={() => {
              setResult(null)
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
            onSave={handleSave}
          />
        </div>
      )}
    </div>
  )
}

interface FormFieldProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  placeholder?: string
}

function FormField({ label, name, value, onChange, error, placeholder }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        type="number"
        step="any"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${error ? "border-destructive" : ""}`}
      />
      {error && <p className="text-sm text-destructive font-medium">{error}</p>}
    </div>
  )
}
