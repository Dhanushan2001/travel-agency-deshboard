import {type RouteConfig, route, layout} from "@react-router/dev/routes"

export default [
    route('sign-in','routes/root/sign-in.tsx'),
    layout("routes/admin/admin-layout.tsx",[
        route('dashboard','routes/admin/dashboard.tsx'),
        route('all-users', 'routes/admin/all-users.tsx'),
        route('trips','routes/admin/trips.tsx'),
        route('trips/create','routes/admin/create-trip.tsx'),
        route('trips/create/summary','routes/admin/trip-summary.tsx'),
        route('trips/:id','routes/admin/trip-details.tsx'),
        route('payment','routes/admin/payment.tsx'),
        route('payment/success','routes/admin/payment-success.tsx'),
       // route('trips','routes/admin/trip-detail.tsx'),


    ]),

] satisfies RouteConfig;