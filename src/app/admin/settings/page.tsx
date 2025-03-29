import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteSettingsForm } from "@/components/admin/site-settings-form"
import { AccountSettingsForm } from "@/components/admin/account-settings-form"

export const metadata: Metadata = {
  title: "Cài đặt | Language Center",
  description: "Cài đặt hệ thống Language Center",
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Cài đặt</h1>
        <p className="text-muted-foreground">Quản lý cài đặt hệ thống Language Center</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">Cài đặt chung</TabsTrigger>
          <TabsTrigger value="account">Tài khoản</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt chung</CardTitle>
              <CardDescription>Quản lý cài đặt chung của hệ thống</CardDescription>
            </CardHeader>
            <CardContent>
              <SiteSettingsForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt tài khoản</CardTitle>
              <CardDescription>Quản lý thông tin tài khoản của bạn</CardDescription>
            </CardHeader>
            <CardContent>
              <AccountSettingsForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

