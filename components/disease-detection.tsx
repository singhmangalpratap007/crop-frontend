"use client"

import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from "react"
import Image from "next/image"
import {
  Upload, Camera, Microscope, CheckCircle2, AlertTriangle, XCircle,
  RefreshCw, Loader2, ChevronDown, Leaf, Shield, Zap, Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/context"

type CropKey = "tomato" | "potato" | "corn" | "rice" | "cotton" | "wheat"

interface DiseaseResult {
  disease: string
  isHealthy: boolean
  confidence: number
  description: string
  causes: string[]
  treatment: string[]
  prevention: string[]
  severity: "low" | "medium" | "high" | "none"
}

const CROP_OPTIONS: CropKey[] = ["tomato", "potato", "corn", "rice", "cotton", "wheat"]

const SEVERITY_CONFIG = {
  none: { color: "text-green-400", bg: "bg-green-500/20 border-green-500/30", label: "Healthy" },
  low: { color: "text-yellow-400", bg: "bg-yellow-500/20 border-yellow-500/30", label: "Low Risk" },
  medium: { color: "text-orange-400", bg: "bg-orange-500/20 border-orange-500/30", label: "Moderate Risk" },
  high: { color: "text-red-400", bg: "bg-red-500/20 border-red-500/30", label: "High Risk" },
}

export function DiseaseDetection() {
  const { t } = useLanguage()
  const [selectedCrop, setSelectedCrop] = useState<CropKey | "">("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<DiseaseResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((file: File) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"]
    if (!allowed.includes(file.type)) {
      setError("Please upload a JPG, PNG, or WebP image.")
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be under 10 MB.")
      return
    }
    setError(null)
    setResult(null)
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }, [])

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const analyze = async () => {
    if (!imageFile) { setError(t("disease.noImage")); return }
    if (!selectedCrop) { setError(t("disease.noCrop")); return }

    setIsAnalyzing(true)
    setError(null)

    try {
      const form = new FormData()
      form.append("image", imageFile)
      form.append("cropType", t(`disease.crops.${selectedCrop}`))

      const res = await fetch("/api/disease", { method: "POST", body: form })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || t("disease.analysisError"))
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : t("disease.analysisError"))
    } finally {
      setIsAnalyzing(false)
    }
  }

  const reset = () => {
    setImageFile(null)
    setImagePreview(null)
    setResult(null)
    setError(null)
    setSelectedCrop("")
    if (fileInputRef.current) fileInputRef.current.value = ""
    if (cameraInputRef.current) cameraInputRef.current.value = ""
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">

      {/* Crop Selector */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          {t("disease.selectCrop")}
        </label>
        <div className="relative">
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value as CropKey)}
            className="w-full appearance-none bg-[#1a2e1c] border border-white/15 text-white rounded-xl px-4 py-3 pr-10 text-sm outline-none focus:border-green-500/60 transition-colors cursor-pointer"
          >
            <option value="" disabled className="bg-[#1a2e1c] text-gray-400">{t("disease.selectCropPlaceholder")}</option>
            {CROP_OPTIONS.map((crop) => (
              <option key={crop} value={crop} className="bg-[#1a2e1c] text-white">
                {t(`disease.crops.${crop}`)}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm space-y-4">
        <p className="text-sm font-medium text-gray-300">{t("disease.uploadLabel")}</p>

        {/* Hidden inputs */}
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onFileChange} />
        <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onFileChange} />

        {/* Drag-and-drop zone */}
        <div
          onDrop={onDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => !imagePreview && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl transition-all duration-200 overflow-hidden ${
            isDragging
              ? "border-green-400 bg-green-500/10 scale-[1.01]"
              : imagePreview
              ? "border-green-600/40 cursor-default"
              : "border-white/20 hover:border-green-500/50 hover:bg-white/5 cursor-pointer"
          }`}
        >
          {imagePreview ? (
            <div className="relative">
              <div className="relative w-full h-64">
                <Image src={imagePreview} alt="Leaf preview" fill className="object-contain" />
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); reset() }}
                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-3">
              <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center">
                <Upload className="w-7 h-7 text-green-400" />
              </div>
              <div>
                <p className="text-white font-medium">{t("disease.dragDrop")}</p>
                <p className="text-gray-400 text-sm mt-1">{t("disease.or")}</p>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}
                  className="bg-green-600/80 hover:bg-green-600 text-white rounded-lg"
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  {t("disease.browse")}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); cameraInputRef.current?.click() }}
                  variant="outline"
                  className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white rounded-lg"
                >
                  <Camera className="w-3.5 h-3.5 mr-1.5" />
                  {t("disease.cameraUpload")}
                </Button>
              </div>
              <p className="text-xs text-gray-500">{t("disease.uploadInstructions")}</p>
            </div>
          )}
        </div>

        {/* If image uploaded, show change/camera buttons */}
        {imagePreview && (
          <div className="flex gap-3">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white rounded-lg flex-1"
            >
              <Upload className="w-3.5 h-3.5 mr-1.5" />
              {t("disease.browse")}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => cameraInputRef.current?.click()}
              className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white rounded-lg flex-1"
            >
              <Camera className="w-3.5 h-3.5 mr-1.5" />
              {t("disease.cameraUpload")}
            </Button>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-300 text-sm animate-in fade-in">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Analyze Button */}
      {!result && (
        <Button
          onClick={analyze}
          disabled={isAnalyzing || !imageFile || !selectedCrop}
          className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-green-900/30 disabled:opacity-50 disabled:cursor-not-allowed text-base"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 w-5 h-5 animate-spin" />
              {t("disease.analyzing")}
            </>
          ) : (
            <>
              <Microscope className="mr-2 w-5 h-5" />
              {t("disease.analyze")}
            </>
          )}
        </Button>
      )}

      {/* Loading Animation */}
      {isAnalyzing && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center space-y-4 animate-in fade-in">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-green-500/20 animate-ping" />
            <div className="absolute inset-2 rounded-full border-4 border-green-500/40 animate-spin border-t-green-400" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Microscope className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <p className="text-gray-300 font-medium">{t("disease.analyzing")}</p>
          <p className="text-gray-500 text-sm">Analyzing leaf image with AI vision...</p>
        </div>
      )}

      {/* Results */}
      {result && !isAnalyzing && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Microscope className="w-5 h-5 text-green-400" />
            {t("disease.resultTitle")}
          </h2>

          {/* Main Result Card */}
          <div className={`border rounded-2xl p-6 ${SEVERITY_CONFIG[result.severity].bg}`}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{t("disease.diseaseName")}</p>
                <h3 className={`text-2xl font-bold ${result.isHealthy ? "text-green-400" : "text-white"}`}>
                  {result.isHealthy ? t("disease.healthy") : result.disease}
                </h3>
                {result.isHealthy && (
                  <p className="text-gray-300 text-sm">{t("disease.healthyDesc")}</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                {result.isHealthy ? (
                  <CheckCircle2 className="w-10 h-10 text-green-400" />
                ) : (
                  <AlertTriangle className={`w-10 h-10 ${SEVERITY_CONFIG[result.severity].color}`} />
                )}
                <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${SEVERITY_CONFIG[result.severity].bg} ${SEVERITY_CONFIG[result.severity].color}`}>
                  {SEVERITY_CONFIG[result.severity].label}
                </span>
              </div>
            </div>

            {/* Confidence Bar */}
            <div className="mt-5 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">{t("disease.confidence")}</span>
                <span className="font-bold text-white">{result.confidence}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full transition-all duration-700 ${
                    result.confidence >= 80
                      ? "bg-gradient-to-r from-green-500 to-emerald-400"
                      : result.confidence >= 60
                      ? "bg-gradient-to-r from-yellow-500 to-amber-400"
                      : "bg-gradient-to-r from-red-500 to-orange-400"
                  }`}
                  style={{ width: `${result.confidence}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-blue-400" />
              <h4 className="font-semibold text-white text-sm">{t("disease.description")}</h4>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">{result.description}</p>
          </div>

          {!result.isHealthy && (
            <>
              {/* Causes */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <h4 className="font-semibold text-white text-sm">{t("disease.causes")}</h4>
                </div>
                <ul className="space-y-2">
                  {result.causes.map((cause, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="w-5 h-5 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs text-amber-400 font-bold">{i + 1}</span>
                      {cause}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Treatment */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-green-400" />
                  <h4 className="font-semibold text-white text-sm">{t("disease.treatment")}</h4>
                </div>
                <ul className="space-y-2">
                  {result.treatment.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prevention */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <h4 className="font-semibold text-white text-sm">{t("disease.prevention")}</h4>
                </div>
                <ul className="space-y-2">
                  {result.prevention.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <Leaf className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {/* Analyze Another */}
          <Button
            onClick={reset}
            variant="outline"
            className="w-full h-11 bg-transparent hover:bg-white/10 text-white hover:text-white border-white/30 rounded-xl font-medium"
          >
            <RefreshCw className="mr-2 w-4 h-4" />
            {t("disease.analyzeAnother")}
          </Button>
        </div>
      )}
    </div>
  )
}
