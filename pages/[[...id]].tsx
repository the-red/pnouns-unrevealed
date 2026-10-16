import Head from 'next/head'
import { useRouter } from 'next/router'
import type { GetServerSideProps } from 'next'
import { useRef, useState, useEffect } from 'react'
import { generateSVGDocument } from './api/contract'

type Props = {
  tokenId: number
}

// `/` は 0 番、`/123` は 123 番。それ以外のパスは 404
export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
  const segments = (params?.id as string[] | undefined) ?? []
  if (segments.length === 0) return { props: { tokenId: 0 } }
  if (segments.length === 1 && /^\d+$/.test(segments[0])) return { props: { tokenId: Number(segments[0]) } }
  return { notFound: true }
}

export default function Home({ tokenId }: Props) {
  const router = useRouter()
  const [svg, setSvg] = useState<string>()
  // 初回表示時もすぐ取得を始めるので true で開始する
  const [loading, setLoading] = useState(true)
  const inputEl = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // 連続で ID を切り替えたとき、古いリクエストの結果で上書きしないようにする
    let cancelled = false
    setLoading(true)
    generateSVGDocument(tokenId)
      .then((svgXml) => {
        if (!cancelled) setSvg(Buffer.from(svgXml).toString('base64'))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [tokenId])

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
              if (Number.isInteger(value) && value >= 0) {
                router.push(`/${value}`)
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
                  // ブラウザの戻る・進むで ID が変わったときに入力欄も追従させる
                  key={tokenId}
                  defaultValue={tokenId}
                />
                <button className="btn btn-secondary" type="submit" id="button-addon2">
                  Show
                </button>
              </div>
            </div>
            <div className="col-md-1 col-3"></div>
            <div className="col-md-6 col-12">
              {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ aspectRatio: '1 / 1' }}>
                  <div
                    className="spinner-border text-secondary"
                    style={{ width: '3rem', height: '3rem' }}
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                svg && (
                  <a href={`/api/images/${tokenId}`} target="_blank" rel="noreferrer">
                    <picture>
                      <img src={`data:image/svg+xml;base64,${svg}`} alt={`${tokenId}.svg`} />
                    </picture>
                  </a>
                )
              )}
            </div>
            <div className="col-md-1"></div>
          </form>
        </div>
      </main>
    </>
  )
}
