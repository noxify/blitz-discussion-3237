import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getShipments from "app/shipments/queries/getShipments"

const ITEMS_PER_PAGE = 100

export const ShipmentsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ shipments, hasMore }] = usePaginatedQuery(getShipments, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {shipments.map((shipment) => (
          <li key={shipment.id}>
            <Link href={Routes.ShowShipmentPage({ shipmentId: shipment.id })}>
              <a>{shipment.name}</a>
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const ShipmentsPage = () => {
  return (
    <>
      <Head>
        <title>Shipments</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewShipmentPage()}>
            <a>Create Shipment</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <ShipmentsList />
        </Suspense>
      </div>
    </>
  )
}

// ShipmentsPage.authenticate = false
// ShipmentsPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShipmentsPage
