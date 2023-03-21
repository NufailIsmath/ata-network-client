# ata-network-client

To run this client-side Next.Js app:

● Run `npm i` to install packages

● Rename `.env.example` as .env and add your NEXT_PUBLIC_BASE_URL

    Note:	The above variable specifies our API Base URL Note - Run ata-network-server to get the API Base URL

● Run `npm run dev` to start the client side

● Update the relayer public key based on your relayer address (that executes meta-tx in ```ata-network-relayer```)  in `src/utils/config.js`

     
        export const relayer = {
            publicKey: "<YOUR_RELAYER_PUBLIC_KEY"
        }
        
