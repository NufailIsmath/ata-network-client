# ata-network-client

To run this client-side Next.Js app:

● Run `npm i` to install packages

● Rename `.env.example` as .env and add your NEXT_PUBLIC_BASE_URL

    Note:	The above variable specifies our API Base URL Note - Run ata-network-server to get the API Base URL

● Run `npm run dev` to start the client side

● Update the relayer public key based on your relayer address (that executes meta-tx in ```ata-network-relayer```)  in `src/utils/config.js`

     
        export const relayer = {
            publicKey: "<YOUR_RELAYER_PUBLIC_KEY>"
        }

● Please execute Approve function before executing the meta-tx. Since the relayer need approval of the user's fund to transfer:

Token1 - [0xA9e668d6f301Ac5e8D6D0A31a8a130D21D57689d](https://mumbai.polygonscan.com/address/0xa9e668d6f301ac5e8d6d0a31a8a130d21d57689d)  

Token2 - [0xF60ade3278fb56AEC843c0915cCe6ceed3139e74](https://mumbai.polygonscan.com/address/0xF60ade3278fb56AEC843c0915cCe6ceed3139e74) 

Token3 - [0xd0307DE6C85D4dfe782cfb9bB003A7814ace44f1](https://mumbai.polygonscan.com/address/0xd0307DE6C85D4dfe782cfb9bB003A7814ace44f1) 

        
