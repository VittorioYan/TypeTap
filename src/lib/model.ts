export type WorkflowType={
    id:string,
    name:string,
    description?:string,
    target:string,
    startPage:string,
    steps:StepType[]
}

export type StepType={
    description:string,
    actions:ActionType[]
}

export type ActionType={
    tool:string,
    arguments:any
    
}