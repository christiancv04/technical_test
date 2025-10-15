"use client"

import { Button, Popconfirm } from "antd"
import { DeleteOutlined } from "@ant-design/icons"
import { JSX } from "react"

interface Props {
    onDelete: () => void
}

export function TableActions({ onDelete }: Props): JSX.Element {
    return (
        <Popconfirm
            title="¿Eliminar usuario?"
            onConfirm={onDelete}
            okText="Sí"
            cancelText="No"
            okButtonProps={{ style: { backgroundColor: "#516E80", borderColor: "#516E80", color: "#fff" } }}
            cancelButtonProps={{ style: { color: "#516E80", borderColor: "#516E80" } }}
        >
            <Button danger size="middle" icon={<DeleteOutlined />} />
        </Popconfirm>
    )
}
