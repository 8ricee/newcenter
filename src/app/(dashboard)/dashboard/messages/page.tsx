import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Search, Send } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { authOptions } from "@/lib/auth"

export default async function MessagesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  // Giả lập dữ liệu tin nhắn
  const conversations = [
    {
      id: 1,
      with: {
        id: 101,
        name: "Nguyễn Thị Minh",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Giáo viên",
      },
      lastMessage: {
        content: "Chào bạn, buổi học tiếp theo của chúng ta sẽ vào thứ 4 tuần sau nhé.",
        timestamp: "2025-03-29T15:30:00",
        isRead: true,
        sender: "them",
      },
      unreadCount: 0,
    },
    {
      id: 2,
      with: {
        id: 102,
        name: "Trần Văn Hùng",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Giáo viên",
      },
      lastMessage: {
        content: "Bài tập về nhà của bạn đã được chấm. Bạn có thể xem kết quả trên hệ thống.",
        timestamp: "2025-03-28T10:15:00",
        isRead: false,
        sender: "them",
      },
      unreadCount: 2,
    },
    {
      id: 3,
      with: {
        id: 103,
        name: "Phòng Học Vụ",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Nhân viên",
      },
      lastMessage: {
        content: "Xin chào, chúng tôi xin thông báo lịch học của bạn đã được cập nhật.",
        timestamp: "2025-03-27T09:45:00",
        isRead: true,
        sender: "them",
      },
      unreadCount: 0,
    },
    {
      id: 4,
      with: {
        id: 104,
        name: "Lê Thị Hương",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Giáo viên",
      },
      lastMessage: {
        content: "Cảm ơn cô. Em sẽ chuẩn bị bài thuyết trình cho buổi học tới.",
        timestamp: "2025-03-26T16:20:00",
        isRead: true,
        sender: "you",
      },
      unreadCount: 0,
    },
  ]

  // Giả lập tin nhắn của cuộc trò chuyện đang chọn
  const selectedConversation = {
    id: 1,
    with: {
      id: 101,
      name: "Nguyễn Thị Minh",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Giáo viên",
      course: "Tiếng Anh giao tiếp cơ bản",
      lastSeen: "Vừa mới truy cập",
    },
    messages: [
      {
        id: 1,
        content: "Chào bạn, tôi là giáo viên phụ trách lớp Tiếng Anh giao tiếp cơ bản của bạn.",
        timestamp: "2025-03-25T10:00:00",
        sender: "them",
      },
      {
        id: 2,
        content: "Chào cô, rất vui được gặp cô. Em rất háo hức với khóa học này.",
        timestamp: "2025-03-25T10:05:00",
        sender: "you",
      },
      {
        id: 3,
        content: "Tôi cũng rất vui khi bạn tham gia lớp học. Bạn đã có kinh nghiệm học tiếng Anh trước đây chưa?",
        timestamp: "2025-03-25T10:10:00",
        sender: "them",
      },
      {
        id: 4,
        content: "Em đã học tiếng Anh ở trường, nhưng kỹ năng giao tiếp của em còn hạn chế. Em muốn cải thiện khả năng nói và nghe.",
        timestamp: "2025-03-25T10:15:00",
        sender: "you",
      },
      {
        id: 5,
        content: "Đó là mục tiêu rất tốt. Khóa học của chúng ta sẽ tập trung vào kỹ năng giao tiếp thực tế. Bạn có thể cho tôi biết bạn muốn sử dụng tiếng Anh trong tình huống nào không?",
        timestamp: "2025-03-25T10:20:00",
        sender: "them",
      },
      {
        id: 6,
        content: "Em muốn sử dụng tiếng Anh để giao tiếp trong công việc và khi đi du lịch nước ngoài ạ.",
        timestamp: "2025-03-25T10:25:00",
        sender: "you",
      },
      {
        id: 7,
        content: "Tuyệt vời! Chúng ta sẽ tập trung vào các tình huống giao tiếp trong môi trường làm việc và du lịch. Buổi học đầu tiên sẽ vào thứ 2 tuần sau, bạn nhớ chuẩn bị tài liệu nhé.",
        timestamp: "2025-03-25T10:30:00",
        sender: "them",
      },
      {
        id: 8,
        content: "Dạ, em sẽ chuẩn bị đầy đủ. Cảm ơn cô!",
        timestamp: "2025-03-25T10:35:00",
        sender: "you",
      },
      {
        id: 9,
        content: "Chào bạn, buổi học tiếp theo của chúng ta sẽ vào thứ 4 tuần sau nhé.",
        timestamp: "2025-03-29T15:30:00",
        sender: "them",
      },
    ],
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tin nhắn</h1>
        <p className="text-muted-foreground">
          Trò chuyện với giáo viên và nhân viên hỗ trợ.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 h-[calc(100vh-220px)]">
        <Card className="h-full flex flex-col">
          <CardHeader className="pb-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm tin nhắn..."
                className="w-full pl-8"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-0">
            <Tabs defaultValue="all" className="w-full">
              <div className="px-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="all">Tất cả</TabsTrigger>
                  <TabsTrigger value="unread">Chưa đọc</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="all" className="mt-0">
                <div className="space-y-1 p-2">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`flex items-center gap-3 rounded-md p-2 cursor-pointer hover:bg-muted ${conversation.id === selectedConversation.id ? 'bg-muted' : ''
                        } ${conversation.unreadCount > 0 ? 'font-medium' : ''}`}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conversation.with.avatar} alt={conversation.with.name} />
                        <AvatarFallback>
                          {conversation.with.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium truncate">{conversation.with.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatTime(conversation.lastMessage.timestamp)}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {conversation.lastMessage.sender === 'you' ? 'Bạn: ' : ''}
                          {conversation.lastMessage.content}
                        </p>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <div className="flex-shrink-0 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-xs text-primary-foreground">{conversation.unreadCount}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="unread" className="mt-0">
                <div className="space-y-1 p-2">
                  {conversations
                    .filter((conversation) => conversation.unreadCount > 0)
                    .map((conversation) => (
                      <div
                        key={conversation.id}
                        className="flex items-center gap-3 rounded-md p-2 cursor-pointer hover:bg-muted font-medium"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conversation.with.avatar} alt={conversation.with.name} />
                          <AvatarFallback>
                            {conversation.with.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium truncate">{conversation.with.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatTime(conversation.lastMessage.timestamp)}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {conversation.lastMessage.content}
                          </p>
                        </div>
                        <div className="flex-shrink-0 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-xs text-primary-foreground">{conversation.unreadCount}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="h-full flex flex-col">
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedConversation.with.avatar} alt={selectedConversation.with.name} />
                <AvatarFallback>
                  {selectedConversation.with.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{selectedConversation.with.name}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{selectedConversation.with.role}</span>
                  <span>•</span>
                  <span>{selectedConversation.with.course}</span>
                  <span>•</span>
                  <span>{selectedConversation.with.lastSeen}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-4 space-y-4">
            {selectedConversation.messages.map((message, index) => {
              const showDate = index === 0 ||
                new Date(message.timestamp).toDateString() !==
                new Date(selectedConversation.messages[index - 1].timestamp).toDateString();

              return (
                <div key={message.id} className="space-y-4">
                  {showDate && (
                    <div className="flex justify-center">
                      <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                        {formatDate(message.timestamp)}
                      </div>
                    </div>
                  )}
                  <div className={`flex ${message.sender === 'you' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] ${message.sender === 'you' ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg px-4 py-2`}>
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs text-right mt-1 opacity-70">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input placeholder="Nhập tin nhắn..." className="flex-1" />
              <Button size="icon">
                <Send className="h-4 w-4" />
                <span className="sr-only">Gửi</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
