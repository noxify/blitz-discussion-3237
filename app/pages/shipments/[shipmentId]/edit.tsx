import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getShipment from "app/shipments/queries/getShipment"
import updateShipment from "app/shipments/mutations/updateShipment"
import { ShipmentForm, FORM_ERROR } from "app/shipments/components/ShipmentForm"

export const EditShipment = () => {
  const router = useRouter()
  const shipmentId = useParam("shipmentId", "number")
  const [shipment, { setQueryData }] = useQuery(
    getShipment,
    { id: shipmentId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateShipmentMutation] = useMutation(updateShipment)

  return (
    <>
      <Head>
        <title>Edit Shipment {shipment.id}</title>
      </Head>

      <div>
        <h1>Edit Shipment {shipment.id}</h1>
        <pre>{JSON.stringify(shipment, null, 2)}</pre>

        <ShipmentForm
          submitText="Update Shipment"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateShipment}
          initialValues={shipment}
          onSubmit={async (values) => {
            try {
              const updated = await updateShipmentMutation({
                id: shipment.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(Routes.ShowShipmentPage({ shipmentId: updated.id }))
            } catch (error: any) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </div>
    </>
  )
}

const EditShipmentPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditShipment />
      </Suspense>

      <p>
        <Link href={Routes.ShipmentsPage()}>
          <a>Shipments</a>
        </Link>
      </p>
    </div>
  )
}

EditShipmentPage.authenticate = true
EditShipmentPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditShipmentPage
