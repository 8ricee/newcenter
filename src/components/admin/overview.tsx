"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
    {
        name: "T1",
        total: 80000000,
        students: 320,
    },
    {
        name: "T2",
        total: 85000000,
        students: 340,
    },
    {
        name: "T3",
        total: 90000000,
        students: 360,
    },
    {
        name: "T4",
        total: 95000000,
        students: 380,
    },
    {
        name: "T5",
        total: 100000000,
        students: 400,
    },
    {
        name: "T6",
        total: 105000000,
        students: 420,
    },
    {
        name: "T7",
        total: 110000000,
        students: 440,
    },
    {
        name: "T8",
        total: 115000000,
        students: 460,
    },
    {
        name: "T9",
        total: 120000000,
        students: 480,
    },
    {
        name: "T10",
        total: 125000000,
        students: 500,
    },
    {
        name: "T11",
        total: 130000000,
        students: 520,
    },
    {
        name: "T12",
        total: 135000000,
        students: 540,
    },
]

export function Overview() {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value)
    }

    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value / 1000000}M`}
                />
                <Tooltip
                    formatter={(value: number, name: string) => {
                        if (name === "total") {
                            return [formatCurrency(value), "Doanh thu"]
                        }
                        return [value, "Học viên"]
                    }}
                    labelFormatter={(label) => `Tháng ${label}`}
                />
                <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    )
}
