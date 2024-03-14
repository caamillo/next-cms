import { useContext } from "react"
import { MainContext } from "@/contexts/MainContext"

export default function Home() {
  const { t } = useContext(MainContext).translation

  return (
    <div className="w-screen h-screen flex
    justify-center items-center font-bold text-slate-500 text-9xl">
      <p>{ t('message') }</p>
    </div>
  )
}