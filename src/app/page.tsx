"use client"

import { UserTable } from "@/components/UserTable/UserTable"
import { Row, Col } from "antd"
import { JSX } from "react"


export default function Home(): JSX.Element {
  return (
    <Row justify="center" className="min-h-screen bg-gray-50 p-6">
      <Col xs={24} md={22} lg={20} xl={18}>
        <UserTable />
      </Col>
    </Row>
  )
}
