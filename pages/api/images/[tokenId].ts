// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Web3 from 'web3'

type Data = {
  token_id: any
  error: any
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const tokenId = Number(req.query.tokenId as string)

    const web3 = new Web3(`https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`)
    const tokenURIABI = [
      {
        inputs: [{ internalType: 'uint256', name: '_assetId', type: 'uint256' }],
        name: 'generateSVGDocument',
        outputs: [{ internalType: 'string', name: 'document', type: 'string' }],
        stateMutability: 'view' as const,
        type: 'function' as const,
      },
    ]
    const tokenContract = '0x2e5C0BD35995ea7e8903C55ba66f28270310498f'
    const contract = new web3.eth.Contract(tokenURIABI, tokenContract)
    const svgXml = await contract.methods.generateSVGDocument(tokenId).call()

    res.setHeader('Content-Type', 'image/svg+xml')
    res.status(200).write(svgXml)
    res.end()
  } catch (e) {
    res.status(400).json({ token_id: req.query.tokenId, error: e })
  }
}
