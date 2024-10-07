import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import type { Project } from "../utils/types"
import { PayPalScriptProvider, PayPalButtons, PayPalButtonsComponentProps } from "@paypal/react-paypal-js"
interface OrderData {
    id: string;
    details?: Array<{
      issue: string;
      description: string;
    }>;
    debug_id?: string;
}
export default function Projects() {
    const { projectId } = useParams();
    const [projectInfo, getProject] = useState<Project>()
    const [owned, updateOwnership] = useState<Boolean>(true)
    useEffect(() => {
        axios.get(`http://localhost:3000/project/get-by-id`, {
            params: {
                id: projectId
            }
        })
           .then(res => {
                console.log(res)
                getProject(res.data.project)
            })
           .catch(err => console.error(err));
    }, [projectId]);
    const navigate = useNavigate();
    useEffect(() => {
        if (owned){ 
            console.log("You bought this project")
        }
    } , [owned])

    if (!projectInfo) return null;
    
    const createOrder: PayPalButtonsComponentProps["createOrder"] = async () => {
  
        const response = await fetch("http://localhost:3000/project/paypal/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                 projectId: projectId
            }),
        });
        const orderData: OrderData = await response.json();

        return orderData.id;  
    };

    const onApprove: PayPalButtonsComponentProps["onApprove"] = async (data) => {
        await axios.get('http://localhost:3000/project/paypal/payment-approvers', {
            params: {
                id : data.orderID,
                clientId : projectInfo.owner,
                projectId : projectInfo._id
            }
        })
        .then(res => {
            console.log(res)
            if (res.data.status === "COMPLETED") 
                updateOwnership(true)
        })
        .catch(error => console.log(error))
    }

    const styles: PayPalButtonsComponentProps["style"] = {
        shape: "rect",
        layout: "vertical",
    };
    return (
        <div className="projects">
            <PayPalScriptProvider  options={{ clientId: "AQ2NqszK3nzYME18y-qk7IL14WLN6vLlAd2z-omDQwprfFvcNHLqmoDKIM-wX9wVe8783UyOsDGhrSh5" }}>
                <button onClick={() => {navigate('/')}}>Back to home</button>
                <p>Name: {projectInfo.name}</p>
                <p>Description: {projectInfo.description}</p>
                <p>Price: {projectInfo.price.toString()}</p>
                {!owned ?
                <PayPalButtons style={styles} onApprove={onApprove} createOrder={createOrder}/>
                : <button onClick={async () => {
                    // await axios.get('http://localhost:3000/project/download', {
                    //     params: {
                    //         projectId: projectId,
                    //         clientId: projectInfo.owner
                    //     },
                    //     responseType: 'blob'
                    // })
           
                
                    const res = await fetch(`http://localhost:3000/project/download?projectId=${projectId}&clientId=${projectInfo.owner}`,{
                        method: 'GET',
                      
                    })
                    .then(res => res.blob())
                    .then(blob => {
                        const url = window.URL.createObjectURL(
                            new Blob([blob]),
                        );
                        console.log(blob)
                          const link = document.createElement('a');
                          link.href = url;
                          link.setAttribute(
                            'download',
                            `a.png`
                          );
                      
                          link.click();
                      
               
                    })
          
                    
                }}>Download</button>
                }
            </PayPalScriptProvider> 
        </div>
    )
}
