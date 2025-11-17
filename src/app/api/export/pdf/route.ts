import { NextRequest, NextResponse } from 'next/server'
import { jsPDF } from 'jspdf'

interface CallPlan {
  clientName: string
  socialStyle: string
  spinS: string
  spinP: string
  spinI: string
  spinN: string
  storytelling: string
  objection: string
  response: string
}

const styleTips = {
  Driving: "🦁 กลยุทธ์: เข้าประเด็นเร็ว, เน้นผลลัพธ์ (กำไร, ประสิทธิภาพ), เสนอทางเลือกให้เขาตัดสินใจ, อย่าเวิ่นเว้อ",
  Analytical: "🦉 กลยุทธ์: เตรียมข้อมูลแน่น, อ้างอิงตัวเลข/Clinical Data, พูดเป็นขั้นเป็นตอน, ให้เวลาเขาคิด, อย่าเร่งรัด",
  Amiable: "🕊️ กลยุทธ์: สร้างความสัมพันธ์ก่อน, เน้นความปลอดภัย/ความน่าเชื่อถือ, ให้การรับประกัน (Assurance), อย่ากดดัน",
  Expressive: "🎉 กลยุทธ์: ใช้พลังงานสูง, เล่า Story ที่น่าตื่นเต้น, อ้างอิง KOL, ให้เขาเป็นจุดเด่น, อย่าพูดแต่ข้อมูลแห้งๆ"
}

function wrapText(text: string, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word
    if (testLine.length > maxWidth) {
      if (currentLine) {
        lines.push(currentLine)
        currentLine = word
      } else {
        lines.push(word)
      }
    } else {
      currentLine = testLine
    }
  }
  if (currentLine) {
    lines.push(currentLine)
  }
  return lines
}

export async function POST(request: NextRequest) {
  try {
    const callPlan: CallPlan = await request.json()
    
    const styleTipText = callPlan.socialStyle ? styleTips[callPlan.socialStyle as keyof typeof styleTips] : 'N/A'
    
    // Create PDF document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    // Set font to support Thai (use a font that supports Thai characters)
    // For now, we'll use basic approach with English content
    pdf.setFont('helvetica')
    
    // Page dimensions
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 20
    const contentWidth = pageWidth - 2 * margin
    let yPosition = margin

    // Helper function to add text with word wrap
    const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
      pdf.setFontSize(fontSize)
      if (isBold) {
        pdf.setFont('helvetica', 'bold')
      } else {
        pdf.setFont('helvetica', 'normal')
      }
      
      const lines = wrapText(text, Math.floor(contentWidth / (fontSize * 0.3)))
      
      for (const line of lines) {
        if (yPosition > pageHeight - margin) {
          pdf.addPage()
          yPosition = margin
        }
        pdf.text(line, margin, yPosition)
        yPosition += fontSize * 0.5 + 2
      }
      return yPosition
    }

    // Title
    addText('Strategic Call Plan', 20, true)
    yPosition += 10
    
    addText('Professional Sales Planning Tool', 14)
    addText('Supporting Healthcare Representatives', 12)
    yPosition += 15

    // Line separator
    pdf.setDrawColor(100)
    pdf.line(margin, yPosition, pageWidth - margin, yPosition)
    yPosition += 10

    // Section 1: Client Info
    addText('1. Target Client', 16, true)
    yPosition += 5
    addText(callPlan.clientName || 'N/A', 12)
    yPosition += 10

    // Section 2: Social Style
    addText('2. Social Style Strategy', 16, true)
    yPosition += 5
    addText(`Style: ${callPlan.socialStyle || 'N/A'}`, 12)
    yPosition += 5
    addText(styleTipText, 10)
    yPosition += 10

    // Section 3: SPIN Selling
    addText('3. SPIN Selling Plan', 16, true)
    yPosition += 5
    
    addText('[S] Situation - Context Questions:', 12, true)
    addText(callPlan.spinS || 'N/A', 10)
    yPosition += 5
    
    addText('[P] Problem - Pain Point Questions:', 12, true)
    addText(callPlan.spinP || 'N/A', 10)
    yPosition += 5
    
    addText('[I] Implication - Impact Questions:', 12, true)
    addText(callPlan.spinI || 'N/A', 10)
    yPosition += 5
    
    addText('[N] Need-Payoff - Solution Questions:', 12, true)
    addText(callPlan.spinN || 'N/A', 10)
    yPosition += 10

    // Section 4: Story & Objections
    addText('4. Storytelling & Objection Handling', 16, true)
    yPosition += 5
    
    addText('Storytelling to Use:', 12, true)
    addText(callPlan.storytelling || 'N/A', 10)
    yPosition += 5
    
    addText('Expected Objections:', 12, true)
    addText(callPlan.objection || 'N/A', 10)
    yPosition += 5
    
    addText('Response Strategy (Feel-Felt-Found):', 12, true)
    addText(callPlan.response || 'N/A', 10)
    yPosition += 10

    // Footer
    pdf.line(margin, pageHeight - 30, pageWidth - margin, pageHeight - 30)
    addText('Professional Sales Planning Tool', 10)
    addText('Supporting Healthcare Representatives', 10)

    // Generate PDF as Uint8Array
    const pdfBytes = pdf.output('arraybuffer')
    
    const clientName = callPlan.clientName.replace(/\s+/g, '_') || 'Plan'
    const fileName = `Strategic_Call_Plan_${clientName}.pdf`

    return new NextResponse(new Uint8Array(pdfBytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`
      }
    })
  } catch (error) {
    console.error('Error exporting PDF:', error)
    return NextResponse.json(
      { error: 'Failed to export PDF' },
      { status: 500 }
    )
  }
}