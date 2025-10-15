"use client"

import { Space, Switch, Input, Button, Typography } from "antd"
import { ReloadOutlined } from "@ant-design/icons"

const { Text } = Typography

interface Props {
  stripedRows: boolean
  sortByCountry: boolean
  searchTerm: string
  deletedUsers: any[]
  onToggleStriped: (checked: boolean) => void
  onToggleSort: (checked: boolean) => void
  onSearchChange: (term: string) => void
  onRestore: () => void
}

export function UserFilters({
  stripedRows,
  sortByCountry,
  searchTerm,
  deletedUsers,
  onToggleStriped,
  onToggleSort,
  onSearchChange,
  onRestore
}: Props) {
  return (
    <Space
      size={[16, 16]}
      wrap
      align="center"
      className="w-full justify-between"
    >
      <Space align="center">
        <Text className="text-gray-700 font-medium">Filas alternadas:</Text>
        <Switch checked={stripedRows} onChange={onToggleStriped} />
      </Space>

      <Space align="center">
        <Text className="text-gray-700 font-medium">Ordenar por país:</Text>
        <Switch checked={sortByCountry} onChange={onToggleSort} />
      </Space>

      <Input
        placeholder="Buscar por nombre o país"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        allowClear
        className="w-64"
      />

      <Button
        onClick={onRestore}
        icon={<ReloadOutlined />}
        disabled={deletedUsers.length === 0}
        className="!bg-[#516E80] !text-white hover:!bg-[#5b7f94]"
      >
        Restaurar usuarios
      </Button>
    </Space>
  )
}
