import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createShipment from "app/shipments/mutations/createShipment"
import { ShipmentForm, FORM_ERROR } from "app/shipments/components/ShipmentForm"

const NewShipmentPage: BlitzPage = () => {
  const router = useRouter()
  const [createShipmentMutation] = useMutation(createShipment)

  return (
    <div>
      <h1>Create New Shipment</h1>

      <ShipmentForm
        submitText="Create Shipment"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateShipment}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const shipment = await createShipmentMutation(values)
            router.push(Routes.ShowShipmentPage({ shipmentId: shipment.id }))
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href={Routes.ShipmentsPage()}>
          <a>Shipments</a>
        </Link>
      </p>
    </div>
  )
}

// NewShipmentPage.authenticate = true
NewShipmentPage.getLayout = (page) => <Layout title={"Create New Shipment"}>{page}</Layout>

export default NewShipmentPage
