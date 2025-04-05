import { Calendar, Camera, CheckCircle, List, Search, Settings, TrendingUp, UserPlus } from "lucide-react"

interface Step {
  title: string
  description: string
  icon: string
}

export function HowItWorks({ steps }: { steps: Step[] }) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "search":
        return <Search className="h-6 w-6" />
      case "list":
        return <List className="h-6 w-6" />
      case "calendar":
        return <Calendar className="h-6 w-6" />
      case "camera":
        return <Camera className="h-6 w-6" />
      case "user-plus":
        return <UserPlus className="h-6 w-6" />
      case "settings":
        return <Settings className="h-6 w-6" />
      case "trending-up":
        return <TrendingUp className="h-6 w-6" />
      default:
        return <CheckCircle className="h-6 w-6" />
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-4">
      {steps.map((step, index) => (
        <div key={index} className="relative flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            {getIcon(step.icon)}
          </div>
          <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
          <p className="text-muted-foreground">{step.description}</p>

          {/* {index <= steps.length - 1 && (
            <div className="absolute left-1/2 top-8 hidden w-full -translate-x-1/2 border-t border-dashed border-primary md:block" />
          )} */}
        </div>
      ))}
    </div>
  )
}

