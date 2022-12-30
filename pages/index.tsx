import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useRef, useState } from 'react'

export default function Home() {
  const [tokenId, setTokenId] = useState<number>(1)
  const inputEl = useRef<HTMLInputElement>(null)

  return (
    <>
      <Head>
        <title>pNouns Unrevealed</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 style={{ paddingBottom: '2rem' }}>pNouns Unrevealed</h1>

        <div className="container">
          <form
            className="row "
            onSubmit={(e) => {
              e.preventDefault()
              const value = Number(inputEl.current?.value)
              if (Number.isFinite(value)) {
                setTokenId(value)
              }
            }}
          >
            <div className="col-md-1 col-1"></div>
            <div className="col-md-3 col-10">
              <div className="input-group mb-3">
                <input
                  type="number"
                  min={1}
                  max={2100}
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
            <div className="col-md-1 col-1"></div>
            <div className="col-md-6 col-12">
              {Number.isFinite(tokenId) && (
                <a href={`/images/${tokenId}.svg`} target="_blank" rel="noreferrer">
                  <picture>
                    <img src={`/images/${tokenId}.svg`} alt={`${tokenId}.svg`} />
                  </picture>
                </a>
              )}
            </div>
            <div className="col-md-1"></div>
          </form>
        </div>
      </main>
    </>
  )
}
