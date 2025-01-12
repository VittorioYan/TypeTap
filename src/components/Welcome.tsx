import { TextAnimate } from "@/components/ui/text-animate"
import { MinimalCard } from "@/components/ui/minimal-card"
import {templates} from "@/constant/templates"
type QuickStartProps = {
  logo: string
  name: string
  content: string
  clickFunction: () => void
}
export const QuickStart = ({logo,name,content,clickFunction}:QuickStartProps) => {
    return (
    <div className="w-full px-4">
     <MinimalCard className="flex items-center m-2 cursor-pointer " onClick={clickFunction}>
    <img src={logo} className="w-12 h-12 mr-2"></img>
    <div>
    <p className="text-lg">{name}</p>
    <p className="test-sm line-clamp-3 hover:line-clamp-none">{content}</p>
    </div>
      
     </MinimalCard>
    </div>
    )
}

export const Welcome = ({quickFunc}) => {


    return (
    <div>
      
        <TextAnimate text="欢 迎 使 用 TypeTap" type="popIn"/>
        <div className="grid grid-flow-row">
          {
            templates.map((template,index)=>{
              return (
                <QuickStart key={index} logo={template.logo} content={template.description} name={template.name} clickFunction={()=>quickFunc(template.startPage,template.prompt)}/>
              )
            })
          }
        
        </div>
            </div>
    )
}