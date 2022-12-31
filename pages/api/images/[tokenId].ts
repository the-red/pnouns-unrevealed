// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { generateSVGDocument } from '../contract'

type Data = {
  token_id: any
  error: any
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const tokenId = Number(req.query.tokenId as string)
    const svgXml = await generateSVGDocument(tokenId)

    res.setHeader('Content-Type', 'image/svg+xml')
    res.status(200).write(svgXml)
    res.end()
  } catch (e) {
    res.status(400).json({ token_id: req.query.tokenId, error: e })
  }
}
