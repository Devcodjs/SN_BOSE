import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import API from '../../services/api';
import IssueCard from '../issues/IssueCard';
import { SkeletonCard } from '../ui/Skeleton';

import {
  TrendingUp,
  CheckCircle2,
  Copy,
  ArrowRight,
  Flame,
  AlertTriangle,
  CircleAlert,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { PRIORITY_LEVELS } from '../../config/priorityConfig';

/* =========================================================
   FILTER CONFIG
========================================================= */

const FILTERS = [
  {
    key: 'all',
    label: 'All',
    icon: null,
  },
  {
    key: 'critical',
    label: 'Critical',
    level: PRIORITY_LEVELS.CRITICAL,
    icon: AlertTriangle,
  },
  {
    key: 'high',
    label: 'High',
    level: PRIORITY_LEVELS.HIGH,
    icon: CircleAlert,
  },
  {
    key: 'medium',
    label: 'Medium',
    level: PRIORITY_LEVELS.MEDIUM,
    icon: CircleAlert,
  },
  {
    key: 'low',
    label: 'Low',
    level: PRIORITY_LEVELS.LOW,
    icon: ChevronDown,
  },
];

/* =========================================================
   PRIORITY LEVEL CONFIG
========================================================= */

const PRIORITY_INFO = [
  {
    key: 'critical',
    label: 'Critical',
    score: '90–100',
    description: 'Immediate attention required',
    level: PRIORITY_LEVELS.CRITICAL,
    icon: AlertTriangle,
  },
  {
    key: 'high',
    label: 'High',
    score: '75–89',
    description: 'Prompt action required',
    level: PRIORITY_LEVELS.HIGH,
    icon: CircleAlert,
  },
  {
    key: 'medium',
    label: 'Medium',
    score: '50–74',
    description: 'Scheduled resolution',
    level: PRIORITY_LEVELS.MEDIUM,
    icon: CircleAlert,
  },
  {
    key: 'low',
    label: 'Low',
    score: '0–49',
    description: 'Addressed in due course',
    level: PRIORITY_LEVELS.LOW,
    icon: ChevronDown,
  },
];

/* =========================================================
   SECTION LABEL
========================================================= */

function SectionLabel({ children }) {
  return (
    <p
      className="
        text-[11px]
        font-bold
        text-slate-400
        uppercase
        tracking-[0.16em]
      "
    >
      {children}
    </p>
  );
}

/* =========================================================
   PRIORITY LEVEL CARD
========================================================= */

function PriorityLevelCard({ item }) {
  const Icon = item.icon;
  const level = item.level;

  const accentColor = level?.textColor || '#64748b';
  const backgroundColor = level?.background || '#f8fafc';
  const borderColor = level?.border || '#e2e8f0';

  return (
    <div
      className="
        group
        relative
        overflow-hidden
        bg-white
        rounded-2xl
        border
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:shadow-md
      "
      style={{
        borderColor,
      }}
    >
      {/* Priority accent */}
      <div
        className="h-1.5 w-full"
        style={{
          backgroundColor: accentColor,
        }}
      />

      <div className="p-5">

        {/* Header */}
        <div className="flex items-center justify-between gap-4">

          <div className="flex items-center gap-3 min-w-0">

            {/* Icon */}
            <div
              className="
                w-10
                h-10
                rounded-xl
                flex
                items-center
                justify-center
                shrink-0
              "
              style={{
                backgroundColor,
              }}
            >
              <Icon
                size={18}
                strokeWidth={2}
                style={{
                  color: accentColor,
                }}
              />
            </div>

            {/* Priority name */}
            <h3
              className="
                text-[14px]
                font-extrabold
                uppercase
                tracking-wide
              "
              style={{
                color: accentColor,
              }}
            >
              {item.label}
            </h3>
          </div>

          {/* Score */}
          <span
            className="
              shrink-0
              text-[10px]
              font-bold
              whitespace-nowrap
            "
            style={{
              color: accentColor,
            }}
          >
            {item.score}
          </span>
        </div>

        {/* Description */}
        <div className="mt-5">
          <p className="text-[13px] text-slate-500 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Bottom metadata */}
        <div
          className="
            mt-5
            pt-3.5
            border-t
            border-slate-100
            flex
            items-center
            justify-between
          "
        >
          <span
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.12em]
              text-slate-400
            "
          >
            Priority level
          </span>

          <span
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: accentColor,
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function PriorityQueue({ onViewAllIssues }) {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('all');

  /* =======================================================
     PRIORITY QUEUE QUERY
  ======================================================= */

  const { data, isLoading } = useQuery({
    queryKey: [
      'adminIssues',
      'priorityQueue',
      filter,
      page,
    ],

    queryFn: async () => {
      let url =
        `/admin/issues?page=${page}` +
        `&limit=12` +
        `&sort=priority` +
        `&isDuplicate=false` +
        `&status=Pending`;

      if (filter !== 'all') {
        url +=
          `&priority=` +
          `${filter.charAt(0).toUpperCase() + filter.slice(1)}`;
      }

      const res = await API.get(url);

      return res.data;
    },
  });

  /* =======================================================
     DUPLICATE REPORT QUERY
  ======================================================= */

  const { data: dupData } = useQuery({
    queryKey: [
      'adminIssues',
      'pendingDuplicatesCount',
    ],

    queryFn: async () => {
      const res = await API.get(
        '/admin/issues?limit=1&isDuplicate=true&status=Pending'
      );

      return res.data;
    },
  });

  const pendingDuplicateCount =
    dupData?.pagination?.totalItems || 0;

  /* =======================================================
     DATA
  ======================================================= */

  const issues = data?.data || [];
  const pagination = data?.pagination;

  const currentFilterLabel =
    filter === 'all'
      ? 'Priority Queue'
      : `${filter.charAt(0).toUpperCase()}${filter.slice(1)} Priority`;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="space-y-12">

      {/* ===================================================
          PRIORITY QUEUE HEADER
      =================================================== */}

      <section
        className="
          bg-white
          rounded-3xl
          border
          border-slate-200
          shadow-sm
          overflow-hidden
        "
      >

        {/* -----------------------------------------------
            HEADER
        ------------------------------------------------ */}

        <div className="px-6 sm:px-8 py-7">

          <div className="flex items-start gap-4">

            {/* Header icon */}
            <div
              className="
                w-12
                h-12
                rounded-2xl
                bg-indigo-50
                border
                border-indigo-100
                flex
                items-center
                justify-center
                shrink-0
              "
            >
              <TrendingUp
                size={21}
                strokeWidth={2}
                className="text-indigo-600"
              />
            </div>

            {/* Header content */}
            <div className="min-w-0">

              <div className="flex items-center gap-3 flex-wrap">

                <h2
                  className="
                    text-xl
                    font-extrabold
                    text-slate-900
                    tracking-tight
                  "
                >
                  Priority Queue
                </h2>

                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    px-2.5
                    py-1
                    rounded-full
                    bg-indigo-50
                    border
                    border-indigo-100
                    text-indigo-600
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wider
                  "
                >
                  <Flame size={11} />
                  Live
                </span>

              </div>

              <p
                className="
                  text-[13px]
                  text-slate-500
                  mt-2
                  leading-relaxed
                  max-w-3xl
                "
              >
                Issues are automatically ranked using severity,
                corroboration, community upvotes, and report age.
              </p>

            </div>
          </div>
        </div>

        {/* -----------------------------------------------
            DIVIDER
        ------------------------------------------------ */}

        <div className="border-t border-slate-100" />

        {/* -----------------------------------------------
            FILTER AREA
        ------------------------------------------------ */}

        <div
          className="
            bg-slate-50/60
            px-6
            sm:px-8
            py-6
          "
        >

          {/* Filter heading */}
          <div
            className="
              flex
              flex-col
              sm:flex-row
              sm:items-center
              sm:justify-between
              gap-3
              mb-4
            "
          >

            <div>
              <p
                className="
                  text-[11px]
                  font-bold
                  text-slate-400
                  uppercase
                  tracking-[0.15em]
                "
              >
                Filter by priority
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Select a priority level to narrow the queue.
              </p>
            </div>

            {/* Pending count */}
            {pagination?.totalItems !== undefined && (
              <span
                className="
                  self-start
                  sm:self-auto
                  inline-flex
                  items-center
                  px-3
                  py-1.5
                  rounded-full
                  bg-white
                  border
                  border-slate-200
                  text-xs
                  font-semibold
                  text-slate-500
                  whitespace-nowrap
                "
              >
                {pagination.totalItems}{' '}
                {pagination.totalItems === 1
                  ? 'pending issue'
                  : 'pending issues'}
              </span>
            )}

          </div>

          {/* ---------------------------------------------
              FILTER BUTTONS
          ---------------------------------------------- */}

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-3
            "
          >

            {FILTERS.map((item) => {
              const active = filter === item.key;
              const Icon = item.icon;

              const activeStyle = item.level
                ? {
                    backgroundColor:
                      item.level.background,
                    color:
                      item.level.textColor,
                    borderColor:
                      item.level.border,
                  }
                : {
                    backgroundColor: '#eef2ff',
                    color: '#4338ca',
                    borderColor: '#c7d2fe',
                  };

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    setFilter(item.key);
                    setPage(1);
                  }}
                  className={`
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    min-w-[96px]
                    px-4
                    py-2.5
                    rounded-xl
                    border
                    text-[13px]
                    font-bold
                    transition-all
                    duration-150
                    ${
                      active
                        ? 'shadow-sm'
                        : `
                          bg-white
                          border-slate-200
                          text-slate-500
                          hover:text-slate-800
                          hover:border-slate-300
                          hover:bg-slate-50
                        `
                    }
                  `}
                  style={
                    active
                      ? activeStyle
                      : undefined
                  }
                >

                  {Icon && (
                    <Icon
                      size={14}
                      strokeWidth={2}
                      className="shrink-0"
                    />
                  )}

                  <span>{item.label}</span>

                </button>
              );
            })}

          </div>
        </div>
      </section>

      {/* ===================================================
          DUPLICATE NOTICE
      =================================================== */}

      {pendingDuplicateCount > 0 && (
        <section
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-5
            bg-sky-50
            border
            border-sky-200
            rounded-2xl
            px-5
            sm:px-6
            py-5
          "
        >

          <div
            className="
              flex
              items-start
              gap-4
              min-w-0
            "
          >

            {/* Icon */}
            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-white
                border
                border-sky-200
                flex
                items-center
                justify-center
                shrink-0
                shadow-sm
              "
            >
              <Copy
                size={17}
                className="text-sky-600"
              />
            </div>

            {/* Text */}
            <div className="min-w-0">

              <p
                className="
                  text-sm
                  font-bold
                  text-sky-900
                "
              >
                Duplicate reports detected
              </p>

              <p
                className="
                  text-[12px]
                  text-sky-800/80
                  mt-1
                  leading-relaxed
                  max-w-3xl
                "
              >
                <strong>
                  {pendingDuplicateCount}
                </strong>{' '}
                pending{' '}
                {pendingDuplicateCount === 1
                  ? 'report was'
                  : 'reports were'}{' '}
                automatically linked as duplicates.
                They remain hidden from this queue but
                are still included in the Pending count.
              </p>

            </div>
          </div>

          {/* View all */}
          {onViewAllIssues && (
            <button
              type="button"
              onClick={onViewAllIssues}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                shrink-0
                px-4
                py-2.5
                rounded-xl
                text-[12px]
                font-bold
                text-sky-700
                bg-white
                border
                border-sky-200
                hover:bg-sky-100
                hover:text-sky-900
                transition-colors
              "
            >
              View all
              <ArrowRight size={14} />
            </button>
          )}

        </section>
      )}

      {/* ===================================================
          PRIORITY LEVELS
      =================================================== */}

      <section>

        {/* Section heading */}
        <div className="mb-5">

          <SectionLabel>
            Priority Levels
          </SectionLabel>

          <p
            className="
              text-[12px]
              text-slate-500
              mt-1.5
            "
          >
            Score ranges used to determine issue priority.
          </p>

        </div>

        {/* Priority cards */}
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-4
            gap-5
          "
        >

          {PRIORITY_INFO.map((item) => (
            <PriorityLevelCard
              key={item.key}
              item={item}
            />
          ))}

        </div>
      </section>

      {/* ===================================================
          CURRENT QUEUE
      =================================================== */}

      <section>

        {/* -----------------------------------------------
            QUEUE HEADER
        ------------------------------------------------ */}

        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-end
            sm:justify-between
            gap-4
            mb-6
          "
        >

          <div>

            <SectionLabel>
              Current Queue
            </SectionLabel>

            <h3
              className="
                text-xl
                sm:text-2xl
                font-extrabold
                text-slate-900
                tracking-tight
                mt-2
              "
            >
              {currentFilterLabel}
            </h3>

            <p
              className="
                text-[13px]
                text-slate-500
                mt-1.5
              "
            >
              Pending issues requiring administrative attention.
            </p>

          </div>

          {/* Issue count */}
          {pagination?.totalItems !== undefined && (
            <div
              className="
                self-start
                sm:self-auto
                inline-flex
                items-center
                px-3.5
                py-2
                rounded-xl
                bg-slate-100
                text-slate-600
                text-xs
                font-bold
                whitespace-nowrap
              "
            >
              {pagination.totalItems}{' '}
              {pagination.totalItems === 1
                ? 'issue'
                : 'issues'}
            </div>
          )}

        </div>

        {/* -----------------------------------------------
            LOADING STATE
        ------------------------------------------------ */}

        {isLoading ? (
          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
              gap-6
            "
          >
            {[...Array(8)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : issues.length === 0 ? (

          /* ---------------------------------------------
             EMPTY STATE
          ---------------------------------------------- */

          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              py-24
              px-6
              text-center
              bg-white
              rounded-3xl
              border
              border-dashed
              border-slate-300
              shadow-sm
            "
          >

            <div
              className="
                w-16
                h-16
                rounded-2xl
                bg-emerald-50
                border
                border-emerald-100
                flex
                items-center
                justify-center
                mb-5
              "
            >
              <CheckCircle2
                size={29}
                strokeWidth={2}
                className="text-emerald-500"
              />
            </div>

            <h3
              className="
                text-lg
                font-extrabold
                text-slate-900
              "
            >
              Queue is clear
            </h3>

            <p
              className="
                text-sm
                text-slate-500
                max-w-sm
                mt-2
                leading-relaxed
              "
            >
              {filter !== 'all'
                ? `There are no pending ${filter} priority issues right now.`
                : 'There are no pending issues requiring attention right now.'}
            </p>

          </div>

        ) : (

          <>
            {/* -----------------------------------------
                ISSUE CARDS
            ------------------------------------------ */}

            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
                gap-6
              "
            >

              {issues.map((issue) => (
                <IssueCard
                  key={issue._id}
                  issue={issue}
                />
              ))}

            </div>

            {/* -----------------------------------------
                PAGINATION
            ------------------------------------------ */}

            {pagination?.totalPages > 1 && (
              <div
                className="
                  flex
                  justify-center
                  items-center
                  gap-3
                  pt-8
                  mt-8
                  border-t
                  border-slate-100
                "
              >

                {/* Previous */}
                <button
                  type="button"
                  onClick={() =>
                    setPage((p) =>
                      Math.max(1, p - 1)
                    )
                  }
                  disabled={page === 1}
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    px-4
                    py-2.5
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    text-sm
                    font-bold
                    text-slate-600
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                    hover:bg-slate-50
                    hover:text-slate-900
                    transition-colors
                  "
                >
                  <ChevronLeft size={15} />
                  Previous
                </button>

                {/* Page */}
                <div
                  className="
                    px-4
                    py-2.5
                    rounded-xl
                    bg-slate-100
                    text-xs
                    font-bold
                    text-slate-600
                    tabular-nums
                  "
                >
                  Page {page} of {pagination.totalPages}
                </div>

                {/* Next */}
                <button
                  type="button"
                  onClick={() =>
                    setPage((p) =>
                      Math.min(
                        pagination.totalPages,
                        p + 1
                      )
                    )
                  }
                  disabled={
                    page === pagination.totalPages
                  }
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    px-4
                    py-2.5
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    text-sm
                    font-bold
                    text-slate-600
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                    hover:bg-slate-50
                    hover:text-slate-900
                    transition-colors
                  "
                >
                  Next
                  <ChevronRight size={15} />
                </button>

              </div>
            )}

          </>
        )}

      </section>

    </div>
  );
}