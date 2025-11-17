import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const plans = await db.callPlan.findMany({
      orderBy: {
        updatedAt: 'desc'
      }
    })
    
    return NextResponse.json(plans)
  } catch (error) {
    console.error('Error fetching plans:', error)
    return NextResponse.json(
      { error: 'Failed to fetch plans' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const plan = await db.callPlan.create({
      data: {
        clientName: data.clientName,
        socialStyle: data.socialStyle,
        spinS: data.spinS || null,
        spinP: data.spinP || null,
        spinI: data.spinI || null,
        spinN: data.spinN || null,
        storytelling: data.storytelling || null,
        objection: data.objection || null,
        response: data.response || null
      }
    })
    
    return NextResponse.json(plan)
  } catch (error) {
    console.error('Error creating plan:', error)
    return NextResponse.json(
      { error: 'Failed to create plan' },
      { status: 500 }
    )
  }
}