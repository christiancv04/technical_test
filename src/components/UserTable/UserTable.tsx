"use client"

import { useState, useEffect, JSX } from "react"
import Image from "next/image"
import { Table, Alert, message, Row, Col, Card, Typography } from "antd"
import type { TablePaginationConfig } from "antd"
import { User } from "@/types/slices/randomType"
import { UserAPI } from "@/api/UserAPI"
import { useDebounce } from "@/hooks/useDebounce"
import { UserFilters } from "../UserFilters/UserFilters"
import { TableActions } from "../TableAction/TableActions"

import './styles/UserTable.css'

const { Title } = Typography

export function UserTable(): JSX.Element {
    const [users, setUsers] = useState<User[]>([])
    const [originalUsers, setOriginalUsers] = useState<User[]>([])
    const [deletedUsers, setDeletedUsers] = useState<User[]>([])
    const [perPage, setPerPage] = useState<number>(100)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [stripedRows, setStripedRows] = useState<boolean>(false)
    const [sortByCountry, setSortByCountry] = useState<boolean>(false)
    const [searchTerm, setSearchTerm] = useState<string>("")

    const debouncedSearch = useDebounce(searchTerm, 350)

    useEffect(() => {
        getUsers(perPage)
    }, [perPage])

    useEffect(() => {
        const term = debouncedSearch.trim().toLowerCase()

        if (!term) {
            setUsers(sortByCountry ? sortUsersByCountry(originalUsers) : originalUsers)
            return
        }

        const filtered = originalUsers.filter(
            (u) =>
                `${u.name.first} ${u.name.last}`.toLowerCase().includes(term) ||
                u.location.country.toLowerCase().includes(term)
        )
        setUsers(sortByCountry ? sortUsersByCountry(filtered) : filtered)
    }, [debouncedSearch, sortByCountry, originalUsers])

    const getUsers = async (results: number): Promise<void> => {
        try {
            setLoading(true)
            setError(null)

            const resp = await UserAPI.get(results)
            const data = resp?.results || []

            setUsers(sortByCountry ? sortUsersByCountry(data) : data)
            setOriginalUsers(data)
            setDeletedUsers([])
        } catch {
            setError("No se pudo obtener los usuarios")
            message.error("Error al cargar usuarios")
        } finally {
            setLoading(false)
        }
    }

    const sortUsersByCountry = (data: User[]): User[] =>
        [...data].sort((a, b) =>
            a.location.country.localeCompare(b.location.country)
        )

    const handleTableChange = (p: TablePaginationConfig): void => {
        const { current, pageSize } = p
        setCurrentPage(current ?? 1)

        if (pageSize && pageSize !== perPage) {
            setPerPage(pageSize)
        }
    }

    const handleDeleteUser = (uuid: string): void => {
        const remaining = users.filter((u) => u.login.uuid !== uuid)
        const removed = users.find((u) => u.login.uuid === uuid)

        if (removed) {
            setDeletedUsers((prev) => [...prev, removed])
        }

        setUsers(remaining)
        message.success("Usuario eliminado")
    }

    const handleRestoreUsers = (): void => {
        setUsers(originalUsers)
        setDeletedUsers([])
        message.success("Usuarios restaurados")
    }

    const columns = [
        {
            title: "Nombre",
            dataIndex: "name",
            key: "name",
            render: (name: User["name"]) => `${name.first} ${name.last}`,
            sorter: (a: User, b: User) => a.name.first.localeCompare(b.name.first)
        },
        {
            title: "Email", dataIndex: "email", key: "email",
            sorter: (a: User, b: User) => a.email.localeCompare(b.email)
        },
        {
            title: "Género", dataIndex: "gender", key: "gender",
            sorter: (a: User, b: User) => a.gender.localeCompare(b.gender)
        },
        {
            title: "País",
            dataIndex: "location",
            key: "country",
            render: (loc: User["location"]) => loc.country,
            sorter: (a: User, b: User) =>
                a.location.country.localeCompare(b.location.country)
        },
        {
            title: "Foto",
            dataIndex: "picture",
            render: (pic: User["picture"]) => (
                <Image
                    src={pic.thumbnail}
                    alt="Foto"
                    width={40}
                    height={40}
                    className="rounded-full shadow-sm"
                />
            )
        },
        {
            title: "Acciones",
            key: "acciones",
            render: (_: unknown, record: User) => (
                <TableActions onDelete={() => handleDeleteUser(record.login.uuid)} />
            )
        }
    ]

    return (
        <Card className="shadow-sm rounded-2xl border border-gray-100 p-4 bg-white">
            <Row gutter={[16, 16]} justify="center" align="middle" className="mb-4">
                <Col xs={24}>
                    <Title
                        level={3}
                        className="!text-[#516E80] !text-2xl !font-semibold text-center mb-6"
                    >
                        Lista de Usuarios
                    </Title>
                </Col>
            </Row>

            <Row gutter={[16, 16]} className="mb-4">
                <Col xs={24}>
                    <UserFilters
                        stripedRows={stripedRows}
                        sortByCountry={sortByCountry}
                        searchTerm={searchTerm}
                        deletedUsers={deletedUsers}
                        onToggleStriped={setStripedRows}
                        onToggleSort={setSortByCountry}
                        onSearchChange={setSearchTerm}
                        onRestore={handleRestoreUsers}
                    />
                </Col>
            </Row>

            <Row>
                <Col xs={24}>
                    {error && <Alert type="error" message={error} showIcon className="mb-4" />}

                    <Table
                        columns={columns}
                        dataSource={users}
                        rowKey={(r) => r.login.uuid}
                        pagination={{
                            current: currentPage,
                            pageSize: perPage,
                            total: users.length,
                            pageSizeOptions: ['100'],
                        }}
                        loading={loading}
                        onChange={handleTableChange}
                        rowClassName={(_, i) =>
                            stripedRows && i % 2 === 0
                                ? "bg-gray-100 hover:bg-gray-200 transition-colors"
                                : "hover:bg-gray-100 transition-colors"
                        }
                        className="custom-table"
                    />
                </Col>
            </Row>
        </Card>
    )
}
