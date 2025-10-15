"use client"
import { UserTable } from "@/components/UserTable"
import { Row, Col } from "antd"


export default function Home() {
  return (
    <Row justify="center" className="min-h-screen bg-gray-50 p-6">
      <Col xs={24} md={22} lg={20} xl={18}>
        <UserTable />
      </Col>
    </Row>
  )
}
