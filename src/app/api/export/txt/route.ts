import { NextRequest, NextResponse } from 'next/server'

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
  Driving: "🦁 **กลยุทธ์:** เข้าประเด็นเร็ว, เน้นผลลัพธ์ (กำไร, ประสิทธิภาพ), เสนอทางเลือกให้เขาตัดสินใจ, อย่าเวิ่นเว้อ",
  Analytical: "🦉 **กลยุทธ์:** เตรียมข้อมูลแน่น, อ้างอิงตัวเลข/Clinical Data, พูดเป็นขั้นเป็นตอน, ให้เวลาเขาคิด, อย่าเร่งรัด",
  Amiable: "🕊️ **กลยุทธ์:** สร้างความสัมพันธ์ก่อน, เน้นความปลอดภัย/ความน่าเชื่อถือ, ให้การรับประกัน (Assurance), อย่ากดดัน",
  Expressive: "🎉 **กลยุทธ์:** ใช้พลังงานสูง, เล่า Story ที่น่าตื่นเต้น, อ้างอิง KOL, ให้เขาเป็นจุดเด่น, อย่าพูดแต่ข้อมูลแห้งๆ"
}

export async function POST(request: NextRequest) {
  try {
    const callPlan: CallPlan = await request.json()
    
    const styleTipText = callPlan.socialStyle ? styleTips[callPlan.socialStyle as keyof typeof styleTips].replace(/\*\*/g, '') : 'N/A'
    
    const content = `
แผนการเข้าพบ (Strategic Call Plan)
=======================================

1. ลูกค้าเป้าหมาย
----------------
${callPlan.clientName || 'N/A'}


2. กลยุทธ์ Social Style
----------------
- Style ที่วิเคราะห์: ${callPlan.socialStyle || 'N/A'}
- ${styleTipText}


3. แผนการใช้ SPIN Selling
-----------------
[S] Situation:
${callPlan.spinS || 'N/A'}

[P] Problem:
${callPlan.spinP || 'N/A'}

[I] Implication:
${callPlan.spinI || 'N/A'}

[N] Need-Payoff:
${callPlan.spinN || 'N/A'}


4. เรื่องเล่าและกลยุทธ์รับมือ
---------------------------
📖 เรื่องเล่า (Storytelling):
${callPlan.storytelling || 'N/A'}

🛡️ ข้อโต้แย้งที่คาดการณ์ (Objections):
${callPlan.objection || 'N/A'}

🤝 กลยุทธ์รับมือ (Response Strategy):
${callPlan.response || 'N/A'}

---------------------------
Professional Sales Planning Tool
Supporting Healthcare Representatives
`.trim()

    const clientName = callPlan.clientName.replace(/\s+/g, '_') || 'Plan'
    const fileName = `Strategic_Call_Plan_${clientName}.txt`

    // Create a Uint8Array with UTF-8 encoding
    const encoder = new TextEncoder()
    const uint8Array = encoder.encode(content)

    return new NextResponse(uint8Array, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="${fileName}"`
      }
    })
  } catch (error) {
    console.error('Error exporting TXT:', error)
    return NextResponse.json(
      { error: 'Failed to export file' },
      { status: 500 }
    )
  }
}