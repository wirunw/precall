'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { saveAs } from 'file-saver'
import { 
  User, 
  Users, 
  MessageCircle, 
  BookOpen, 
  Shield, 
  Handshake, 
  FileText, 
  FileDown, 
  RotateCcw,
  Rocket,
  Calculator,
  Heart,
  Megaphone,
  Download,
  Loader2,
  Save,
  FolderOpen,
  Trash2
} from 'lucide-react'
import { toast } from 'sonner'

interface CallPlan {
  id?: string
  clientName: string
  socialStyle: string
  spinS: string
  spinP: string
  spinI: string
  spinN: string
  storytelling: string
  objection: string
  response: string
  createdAt?: string
  updatedAt?: string
}

const styleTips = {
  Driving: {
    icon: Rocket,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    tips: '🦁 **กลยุทธ์:** เข้าประเด็นเร็ว, เน้นผลลัพธ์ (กำไร, ประสิทธิภาพ), เสนอทางเลือกให้เขาตัดสินใจ, อย่าเวิ่นเว้อ'
  },
  Analytical: {
    icon: Calculator,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    tips: '🦉 **กลยุทธ์:** เตรียมข้อมูลแน่น, อ้างอิงตัวเลข/Clinical Data, พูดเป็นขั้นเป็นตอน, ให้เวลาเขาคิด, อย่าเร่งรัด'
  },
  Amiable: {
    icon: Heart,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    tips: '🕊️ **กลยุทธ์:** สร้างความสัมพันธ์ก่อน, เน้นความปลอดภัย/ความน่าเชื่อถือ, ให้การรับประกัน (Assurance), อย่ากดดัน'
  },
  Expressive: {
    icon: Megaphone,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    tips: '🎉 **กลยุทธ์:** ใช้พลังงานสูง, เล่า Story ที่น่าตื่นเต้น, อ้างอิง KOL, ให้เขาเป็นจุดเด่น, อย่าพูดแต่ข้อมูลแห้งๆ'
  }
}

export default function Home() {
  const [callPlan, setCallPlan] = useState<CallPlan>({
    clientName: '',
    socialStyle: '',
    spinS: '',
    spinP: '',
    spinI: '',
    spinN: '',
    storytelling: '',
    objection: '',
    response: ''
  })
  
  const [savedPlans, setSavedPlans] = useState<CallPlan[]>([])
  const [isLoadingPlans, setIsLoadingPlans] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false)

  // Load saved plans on component mount
  useEffect(() => {
    loadSavedPlans()
  }, [])

  const loadSavedPlans = async () => {
    setIsLoadingPlans(true)
    try {
      const response = await fetch('/api/plans')
      if (response.ok) {
        const plans = await response.json()
        setSavedPlans(plans)
      }
    } catch (error) {
      console.error('Error loading plans:', error)
    } finally {
      setIsLoadingPlans(false)
    }
  }

  const savePlan = async () => {
    if (!callPlan.clientName || !callPlan.socialStyle) {
      toast.error('กรุณากรอกชื่อลูกค้าและเลือก Social Style')
      return
    }

    try {
      const response = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(callPlan)
      })
      
      if (response.ok) {
        const savedPlan = await response.json()
        toast.success('บันทึกแผนการเข้าพบเรียบร้อย')
        loadSavedPlans() // Reload plans list
        setIsSaveDialogOpen(false) // Close dialog
      } else {
        throw new Error('Failed to save plan')
      }
    } catch (error) {
      toast.error('ไม่สามารถบันทึกแผนการเข้าพบได้')
    }
  }

  const loadPlan = async (planId: string) => {
    try {
      const response = await fetch(`/api/plans/${planId}`)
      if (response.ok) {
        const plan = await response.json()
        setCallPlan({
          id: plan.id,
          clientName: plan.clientName,
          socialStyle: plan.socialStyle,
          spinS: plan.spinS || '',
          spinP: plan.spinP || '',
          spinI: plan.spinI || '',
          spinN: plan.spinN || '',
          storytelling: plan.storytelling || '',
          objection: plan.objection || '',
          response: plan.response || ''
        })
        toast.success('โหลดแผนการเข้าพบเรียบร้อย')
        setIsLoadDialogOpen(false) // Close dialog
      }
    } catch (error) {
      toast.error('ไม่สามารถโหลดแผนการเข้าพบได้')
    }
  }

  const deletePlan = async (planId: string) => {
    try {
      const response = await fetch(`/api/plans/${planId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        toast.success('ลบแผนการเข้าพบเรียบร้อย')
        loadSavedPlans() // Reload plans list
      }
    } catch (error) {
      toast.error('ไม่สามารถลบแผนการเข้าพบได้')
    }
  }

  const updateCallPlan = (field: keyof CallPlan, value: string) => {
    setCallPlan(prev => ({ ...prev, [field]: value }))
  }

  const exportTXT = async () => {
    if (!callPlan.clientName || !callPlan.socialStyle) {
      toast.error('กรุณากรอกชื่อลูกค้าและเลือก Social Style')
      return
    }

    try {
      const response = await fetch('/api/export/txt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(callPlan)
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Export TXT Error:', errorText)
        throw new Error(`Failed to export: ${response.status}`)
      }
      
      const blob = await response.blob()
      const fileName = `Strategic_Call_Plan_${callPlan.clientName.replace(/\s+/g, '_') || 'Plan'}.txt`
      
      // Use FileSaver.js for reliable download
      saveAs(blob, fileName)
      
      toast.success('ส่งออกไฟล์ TXT สำเร็จ')
    } catch (error) {
      console.error('Export TXT Error:', error)
      toast.error('ไม่สามารถส่งออกไฟล์ TXT ได้')
    }
  }

  const exportPDF = async () => {
    if (!callPlan.clientName || !callPlan.socialStyle) {
      toast.error('กรุณากรอกชื่อลูกค้าและเลือก Social Style')
      return
    }

    setIsExporting(true)
    try {
      const response = await fetch('/api/export/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(callPlan)
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Export PDF Error:', errorText)
        throw new Error(`Failed to export: ${response.status}`)
      }
      
      const blob = await response.blob()
      const fileName = `Strategic_Call_Plan_${callPlan.clientName.replace(/\s+/g, '_') || 'Plan'}.pdf`
      
      // Use FileSaver.js for reliable download
      saveAs(blob, fileName)
      
      toast.success('ส่งออกไฟล์ PDF สำเร็จ')
    } catch (error) {
      console.error('Export PDF Error:', error)
      toast.error('ไม่สามารถส่งออกไฟล์ PDF ได้')
    } finally {
      setIsExporting(false)
    }
  }

  const startOver = () => {
    setCallPlan({
      clientName: '',
      socialStyle: '',
      spinS: '',
      spinP: '',
      spinI: '',
      spinN: '',
      storytelling: '',
      objection: '',
      response: ''
    })
    toast.success('เริ่มใหม่เรียบร้อย')
  }

  const isFormValid = callPlan.clientName && callPlan.socialStyle

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
            Strategic Call Planner
          </h1>
          <p className="text-xl text-slate-600">
            ผู้ช่วยวางแผนการสื่อสาร สู่การเป็น "ที่ปรึกษาที่ไว้วางใจ"
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            {/* Client Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  ขั้นตอนที่ 1: วิเคราะห์ลูกค้า
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="clientName">ชื่อลูกค้า</Label>
                  <Input
                    id="clientName"
                    placeholder="เช่น พญ.สมหญิง, ร้านยาเภสัชกร์, โรงพยาบาลกรุงเทพ"
                    value={callPlan.clientName}
                    onChange={(e) => updateCallPlan('clientName', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Social Style */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  ขั้นตอนที่ 2: วิเคราะห์ Social Style
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={callPlan.socialStyle}
                  onValueChange={(value) => updateCallPlan('socialStyle', value)}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {Object.entries(styleTips).map(([style, config]) => {
                    const Icon = config.icon
                    return (
                      <div key={style} className="relative">
                        <RadioGroupItem value={style} id={style} className="peer sr-only" />
                        <Label
                          htmlFor={style}
                          className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md peer-checked:border-primary peer-checked:bg-primary/5`}
                        >
                          <Icon className={`h-8 w-8 mr-3 ${config.color}`} />
                          <div>
                            <div className="font-semibold">{style}</div>
                            <div className="text-sm text-muted-foreground">
                              {style === 'Driving' && 'เน้นผลลัพธ์'}
                              {style === 'Analytical' && 'เน้นข้อมูล'}
                              {style === 'Amiable' && 'เน้นความสัมพันธ์'}
                              {style === 'Expressive' && 'เน้นการสื่อสาร'}
                            </div>
                          </div>
                        </Label>
                      </div>
                    )
                  })}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* SPIN Planning */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  ขั้นตอนที่ 3: วางแผนชุดคำถาม SPIN
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="spinS">[S] Situation - คำถามเปิด (บริบท)</Label>
                  <Textarea
                    id="spinS"
                    placeholder="เช่น 'ปกติคุณหมอแนะนำการดูแลผู้ป่วยโรคเบาหวานอย่างไรครับ?'"
                    value={callPlan.spinS}
                    onChange={(e) => updateCallPlan('spinS', e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spinP">[P] Problem - คำถามเจาะปัญหา (Pain Point)</Label>
                  <Textarea
                    id="spinP"
                    placeholder="เช่น 'เคยเจอเคสที่ผู้ป่วยบ่นว่า 'ยาแพง' จนไม่ทานต่อเนื่องไหมครับ?'"
                    value={callPlan.spinP}
                    onChange={(e) => updateCallPlan('spinP', e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spinI">[I] Implication - คำถามขยายผลกระทบ (ขยี้ปัญหา)</Label>
                  <Textarea
                    id="spinI"
                    placeholder="เช่น 'การที่ผู้ป่วยไม่ทานยาบ่อยๆ ส่งผลต่อการควบคุมโรค หรือทำให้เกิดภาวะแทรกซ้อนไหมครับ?'"
                    value={callPlan.spinI}
                    onChange={(e) => updateCallPlan('spinI', e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spinN">[N] Need-Payoff - คำถามนำสู่คุณค่า (ทางออก)</Label>
                  <Textarea
                    id="spinN"
                    placeholder="เช่น 'ถ้ามียาที่ผู้ป่วย 'ยอม' ทาน และมีผลข้างเคียงน้อย จะช่วยเพิ่มการรักษาได้อย่างไรบ้างครับ?'"
                    value={callPlan.spinN}
                    onChange={(e) => updateCallPlan('spinN', e.target.value)}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Story & Objections */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  ขั้นตอนที่ 4: เตรียมเรื่องเล่าและรับมือ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="storytelling">📖 เรื่องเล่า (Storytelling) ที่จะใช้</Label>
                  <Textarea
                    id="storytelling"
                    placeholder="เช่น 'เคสคุณป้อม ที่เปลี่ยน 'การรักษาที่ล้มเหลว' เป็น 'ความหวังใหม่''"
                    value={callPlan.storytelling}
                    onChange={(e) => updateCallPlan('storytelling', e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="objection">🛡️ ข้อโต้แย้งที่คาดว่าจะเจอ</Label>
                  <Textarea
                    id="objection"
                    placeholder="เช่น 'ราคาแพง', 'ยายาก', 'ไม่มีข้อมูลวิจัย', 'ผลข้างเคียงเยอะ'"
                    value={callPlan.objection}
                    onChange={(e) => updateCallPlan('objection', e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="response">🤝 กลยุทธ์รับมือ (Feel-Felt-Found)</Label>
                  <Textarea
                    id="response"
                    placeholder="Feel: 'ผมเข้าใจเลยครับว่าเรื่องราคาเป็นปัจจัยสำคัญ...'"
                    value={callPlan.response}
                    onChange={(e) => updateCallPlan('response', e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview & Export */}
          <div className="lg:sticky lg:top-8 space-y-6">
            {/* Export Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileDown className="h-5 w-5" />
                  ส่งออกแผน (Export Plan)
                </CardTitle>
                <CardDescription>
                  เมื่อกรอกข้อมูลครบถ้วน คุณสามารถส่งออกแผนเป็นไฟล์ .txt หรือ .pdf
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    onClick={exportTXT}
                    disabled={!isFormValid}
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Export .txt
                  </Button>
                  <Button 
                    onClick={exportPDF}
                    disabled={!isFormValid || isExporting}
                    className="flex items-center gap-2"
                  >
                    {isExporting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <FileDown className="h-4 w-4" />
                    )}
                    Export .pdf
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2"
                        disabled={!isFormValid}
                      >
                        <Save className="h-4 w-4" />
                        บันทึกแผน
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>บันทึกแผนการเข้าพบ</DialogTitle>
                        <DialogDescription>
                          ต้องการบันทึกแผนการเข้าพบสำหรับ "{callPlan.clientName}" หรือไม่?
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)}>
                          ยกเลิก
                        </Button>
                        <Button onClick={savePlan}>
                          ยืนยันการบันทึก
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isLoadDialogOpen} onOpenChange={setIsLoadDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2"
                      >
                        <FolderOpen className="h-4 w-4" />
                        โหลดแผน ({savedPlans.length})
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>โหลดแผนการเข้าพบที่บันทึกไว้</DialogTitle>
                        <DialogDescription>
                          เลือกแผนการเข้าพบที่ต้องการโหลด
                        </DialogDescription>
                      </DialogHeader>
                      <ScrollArea className="h-[300px] pr-4">
                        {isLoadingPlans ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin" />
                          </div>
                        ) : savedPlans.length === 0 ? (
                          <p className="text-center text-muted-foreground py-8">
                            ยังไม่มีแผนการเข้าพบที่บันทึกไว้
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {savedPlans.map((plan) => (
                              <div
                                key={plan.id}
                                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                              >
                                <div className="flex-1">
                                  <div className="font-medium">{plan.clientName}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {plan.socialStyle} • {new Date(plan.updatedAt || '').toLocaleDateString('th-TH')}
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => loadPlan(plan.id!)}
                                  >
                                    โหลด
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => deletePlan(plan.id!)}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <Button 
                  variant="secondary" 
                  onClick={startOver}
                  className="w-full flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  เริ่มใหม่ทั้งหมด
                </Button>
              </CardContent>
            </Card>

            {/* Live Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Strategic Call Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-6">
                    {/* Client Info */}
                    <div>
                      <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        ลูกค้าเป้าหมาย
                      </h3>
                      <p className="text-muted-foreground">
                        {callPlan.clientName || <span className="text-muted-foreground/50">...</span>}
                      </p>
                    </div>

                    <Separator />

                    {/* Social Style */}
                    <div>
                      <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        กลยุทธ์ Social Style
                      </h3>
                      {callPlan.socialStyle ? (
                        <div className="space-y-2">
                          <Badge variant="secondary" className="text-sm">
                            {callPlan.socialStyle}
                          </Badge>
                          <div className={`p-3 rounded-lg ${styleTips[callPlan.socialStyle as keyof typeof styleTips].bgColor} ${styleTips[callPlan.socialStyle as keyof typeof styleTips].borderColor} border`}>
                            <p className="text-sm">
                              {styleTips[callPlan.socialStyle as keyof typeof styleTips].tips.replace(/\*\*(.*?)\*\*/g, '$1')}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground/50">...</span>
                      )}
                    </div>

                    <Separator />

                    {/* SPIN Selling */}
                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        แผนการใช้ SPIN Selling
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <Badge variant="outline" className="mb-1">[S] Situation</Badge>
                          <p className="text-sm text-muted-foreground">
                            {callPlan.spinS || <span className="text-muted-foreground/50">...</span>}
                          </p>
                        </div>
                        <div>
                          <Badge variant="outline" className="mb-1">[P] Problem</Badge>
                          <p className="text-sm text-muted-foreground">
                            {callPlan.spinP || <span className="text-muted-foreground/50">...</span>}
                          </p>
                        </div>
                        <div>
                          <Badge variant="outline" className="mb-1">[I] Implication</Badge>
                          <p className="text-sm text-muted-foreground">
                            {callPlan.spinI || <span className="text-muted-foreground/50">...</span>}
                          </p>
                        </div>
                        <div>
                          <Badge variant="outline" className="mb-1">[N] Need-Payoff</Badge>
                          <p className="text-sm text-muted-foreground">
                            {callPlan.spinN || <span className="text-muted-foreground/50">...</span>}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Story & Objections */}
                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        เรื่องเล่าและกลยุทธ์รับมือ
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <Badge variant="outline" className="mb-1">📖 เรื่องเล่า</Badge>
                          <p className="text-sm text-muted-foreground">
                            {callPlan.storytelling || <span className="text-muted-foreground/50">...</span>}
                          </p>
                        </div>
                        <div>
                          <Badge variant="outline" className="mb-1">🛡️ ข้อโต้แย้งที่คาดการณ์</Badge>
                          <p className="text-sm text-muted-foreground">
                            {callPlan.objection || <span className="text-muted-foreground/50">...</span>}
                          </p>
                        </div>
                        <div>
                          <Badge variant="outline" className="mb-1">🤝 กลยุทธ์รับมือ</Badge>
                          <p className="text-sm text-muted-foreground">
                            {callPlan.response || <span className="text-muted-foreground/50">...</span>}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-muted-foreground text-sm mt-12 pb-6">
          Professional Sales Planning Tool • Supporting Healthcare Representatives
        </footer>
      </div>
    </div>
  )
}