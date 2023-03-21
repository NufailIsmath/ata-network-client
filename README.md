# ata-network-client

To run this client-side Next.Js app:

● Run `npm i` to install packages

● Rename `.env.example` as .env and add your NEXT_PUBLIC_BASE_URL

    Note:	The above variable specifies our API Base URL Note - Run ata-network-server to get the API Base URL

● Run `npm run dev` to start the client side

● Update the relayer public key based on your relayer address in `src/utils/config.js`

     
        export const relayer = {
            publicKey: "0x73c0D20aB453aD893db78998c7f4c47ED9D86837"
        }
        
