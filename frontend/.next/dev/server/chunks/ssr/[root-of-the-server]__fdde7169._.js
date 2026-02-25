module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/frontend/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/frontend/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/frontend/app/not-found.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/frontend/app/not-found.tsx [app-rsc] (ecmascript)"));
}),
"[project]/frontend/lib/mock/flights.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "flightOffers",
    ()=>flightOffers,
    "scheduleEvents",
    ()=>scheduleEvents
]);
const flightOffers = [
    {
        id: "AF1001",
        flightNo: "AF1001",
        airline: "Airflow Atlantic",
        fromCode: "JFK",
        toCode: "LAX",
        departTime: "07:10",
        arriveTime: "10:40",
        duration: "5h 30m",
        stops: 0,
        priceUsd: 189,
        seatsLeft: 5
    },
    {
        id: "AF2204",
        flightNo: "AF2204",
        airline: "Airflow Atlantic",
        fromCode: "JFK",
        toCode: "SFO",
        departTime: "09:35",
        arriveTime: "13:10",
        duration: "6h 35m",
        stops: 1,
        priceUsd: 172,
        seatsLeft: 12
    },
    {
        id: "AF3320",
        flightNo: "AF3320",
        airline: "SkyBridge",
        fromCode: "ORD",
        toCode: "SEA",
        departTime: "11:50",
        arriveTime: "14:35",
        duration: "4h 45m",
        stops: 0,
        priceUsd: 211,
        seatsLeft: 4
    },
    {
        id: "AF4892",
        flightNo: "AF4892",
        airline: "JetNorth",
        fromCode: "MIA",
        toCode: "BOS",
        departTime: "15:20",
        arriveTime: "18:25",
        duration: "3h 05m",
        stops: 0,
        priceUsd: 134,
        seatsLeft: 18
    }
];
const scheduleEvents = [
    {
        id: "evt-1",
        title: "AF1001 JFK -> LAX",
        start: "2026-03-03T07:10:00",
        end: "2026-03-03T10:40:00",
        extendedProps: {
            gate: "A12",
            aircraft: "A321neo",
            status: "Boarding"
        }
    },
    {
        id: "evt-2",
        title: "AF2204 JFK -> SFO",
        start: "2026-03-04T09:35:00",
        end: "2026-03-04T13:10:00",
        extendedProps: {
            gate: "B4",
            aircraft: "B737-8",
            status: "On Time"
        }
    },
    {
        id: "evt-3",
        title: "AF3320 ORD -> SEA",
        start: "2026-03-05T11:50:00",
        end: "2026-03-05T14:35:00",
        extendedProps: {
            gate: "C9",
            aircraft: "A220-300",
            status: "Delayed"
        }
    },
    {
        id: "evt-4",
        title: "AF4892 MIA -> BOS",
        start: "2026-03-06T15:20:00",
        end: "2026-03-06T18:25:00",
        extendedProps: {
            gate: "D2",
            aircraft: "B737-9",
            status: "On Time"
        }
    }
];
}),
"[project]/frontend/app/search/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SearchPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$mock$2f$flights$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/lib/mock/flights.ts [app-rsc] (ecmascript)");
;
;
function SearchPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-3xl font-black tracking-tight text-slate-900",
                        children: "Search Flights"
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/search/page.tsx",
                        lineNumber: 7,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 text-slate-600",
                        children: "Mock offers now, backend API integration later."
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/search/page.tsx",
                        lineNumber: 8,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/app/search/page.tsx",
                lineNumber: 6,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "grid gap-4",
                children: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$mock$2f$flights$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["flightOffers"].map((flight)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        className: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col justify-between gap-4 md:flex-row md:items-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm font-semibold text-slate-500",
                                            children: [
                                                flight.airline,
                                                " · ",
                                                flight.flightNo
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend/app/search/page.tsx",
                                            lineNumber: 19,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "mt-1 text-2xl font-black tracking-tight text-slate-900",
                                            children: [
                                                flight.fromCode,
                                                " ",
                                                "->",
                                                " ",
                                                flight.toCode
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend/app/search/page.tsx",
                                            lineNumber: 22,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1 text-sm text-slate-600",
                                            children: [
                                                flight.departTime,
                                                " - ",
                                                flight.arriveTime,
                                                " · ",
                                                flight.duration,
                                                " ·",
                                                " ",
                                                flight.stops === 0 ? "Non-stop" : `${flight.stops} stop`
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend/app/search/page.tsx",
                                            lineNumber: 25,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/app/search/page.tsx",
                                    lineNumber: 18,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-right",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs uppercase tracking-wide text-slate-500",
                                            children: "From"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/app/search/page.tsx",
                                            lineNumber: 32,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-3xl font-black text-sky-700",
                                            children: [
                                                "$",
                                                flight.priceUsd
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend/app/search/page.tsx",
                                            lineNumber: 33,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-slate-500",
                                            children: [
                                                flight.seatsLeft,
                                                " seats left"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend/app/search/page.tsx",
                                            lineNumber: 34,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/app/search/page.tsx",
                                    lineNumber: 31,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/app/search/page.tsx",
                            lineNumber: 17,
                            columnNumber: 13
                        }, this)
                    }, flight.id, false, {
                        fileName: "[project]/frontend/app/search/page.tsx",
                        lineNumber: 13,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/frontend/app/search/page.tsx",
                lineNumber: 11,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/app/search/page.tsx",
        lineNumber: 5,
        columnNumber: 5
    }, this);
}
}),
"[project]/frontend/app/search/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/frontend/app/search/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__fdde7169._.js.map