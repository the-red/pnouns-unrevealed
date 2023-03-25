import Head from 'next/head'
import { useRef, useState, useEffect } from 'react'
import { generateSVGDocument } from './api/contract'

const Ads = () => (
  <>
    <a href="https://px.a8.net/svt/ejp?a8mat=3T4O7G+EF62LM+3OP8+HWPVL" rel="nofollow">
      <picture>
        <img
          width="320"
          height="50"
          alt=""
          src="https://www25.a8.net/svt/bgt?aid=230325388872&wid=004&eno=01&mid=s00000017198003008000&mc=1"
        />
      </picture>
    </a>
    <picture>
      <img width="1" height="1" src="https://www19.a8.net/0.gif?a8mat=3T4O7G+EF62LM+3OP8+HWPVL" alt="" />
    </picture>
  </>
)

export default function Home() {
  const [tokenId, setTokenId] = useState<number>(0)
  const [svg, setSvg] = useState<string>()
  const inputEl = useRef<HTMLInputElement>(null)

  const setSVGDocument = async (tokenId: number) => {
    const svgXml = await generateSVGDocument(tokenId)
    setSvg(Buffer.from(svgXml).toString('base64'))
  }

  useEffect(() => {
    setSVGDocument(tokenId)
  }, [])

  return (
    <>
      <Head>
        <title>pNouns Unrevealed</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1
          style={{
            fontFamily: 'LondrinaSolid',
            paddingTop: '1rem',
            paddingLeft: '1rem',
            paddingBottom: '2rem',
          }}
        >
          pNouns Unrevealed
        </h1>

        <div className="container">
          <form
            className="row "
            onSubmit={(e) => {
              e.preventDefault()
              const value = Number(inputEl.current?.value)
              if (Number.isFinite(value)) {
                setTokenId(value)
                setSVGDocument(value)
              }
            }}
          >
            <div className="col-md-1 col-3"></div>
            <div className="col-md-3 col-6">
              <div className="input-group mb-3">
                <input
                  type="number"
                  min={0}
                  className="form-control"
                  placeholder="id"
                  ref={inputEl}
                  defaultValue={tokenId}
                />
                <button className="btn btn-secondary" type="submit" id="button-addon2">
                  Show
                </button>
              </div>
            </div>
            <div className="col-md-1 col-3"></div>
            <div className="col-md-6 col-12">
              {Number.isFinite(tokenId) && (
                <a href={`/api/images/${tokenId}`} target="_blank" rel="noreferrer">
                  <picture>
                    <img src={`data:image/svg+xml;base64,${svg}`} alt={`${tokenId}.svg`} />
                  </picture>
                </a>
              )}
            </div>
            <div className="col-md-1"></div>
          </form>
        </div>
      </main>
      <footer className="container text-center" style={{ paddingTop: '40px', paddingBottom: '20px' }}>
        <Ads />
      </footer>
    </>
  )
}
