export default interface resType  {
    onRequestStart? : () => any,
    onRequestEnd? : () => any,
    onSuccess? : (data? : any) => any,
    onError? : (error? : any) => any,
}