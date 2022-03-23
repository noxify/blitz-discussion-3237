import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getShipment from "app/shipments/queries/getShipment"
import deleteShipment from "app/shipments/mutations/deleteShipment"

export const Shipment = () => {
  const router = useRouter()
  const shipmentId = useParam("shipmentId", "number")
  const [deleteShipmentMutation] = useMutation(deleteShipment)
  const [shipment] = useQuery(getShipment, { id: shipmentId })

  return (
    <>
      <Head>
        <title>Shipment {shipment.id}</title>
      </Head>

      <div>
        <h1>Shipment {shipment.id}</h1>
        <pre>{JSON.stringify(shipment, null, 2)}</pre>

        <Link href={Routes.EditShipmentPage({ shipmentId: shipment.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteShipmentMutation({ id: shipment.id })
              router.push(Routes.ShipmentsPage())
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowShipmentPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.ShipmentsPage()}>
          <a>Shipments</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Shipment />
      </Suspense>
    </div>
  )
}

// ShowShipmentPage.authenticate = true
// ShowShipmentPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowShipmentPage
