import api_url from "../../api_url";
import type resType from "../../types/ResType";

interface putEventUpdateProps extends resType {
    id : number,
    eventData : any,
}

export default async function putEventUpdate({id,eventData,onRequestStart = () => {} ,onRequestEnd = () => {} , onSuccess = ()=>{} ,onError = ()=>{}}:putEventUpdateProps) {
    onRequestStart();
    fetch(`${api_url}/api/orders`,{
        method: "PUT",
        headers: {"Content-Type" : "application/json"},
        body:
    }).then((response)=>{
        onRequestEnd();
        if(!response.ok){
            onError()
            throw new Error("Network response was not ok");
        }
        return response.json();
    }).then((data)=>{
        console.log("Event modified successfully", data);
        onSuccess();
    })
}