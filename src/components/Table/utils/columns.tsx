import React from 'react';
import { CellContext, createColumnHelper } from '@tanstack/react-table';
import { Formation } from '../types';
import {IconChevronArrowDown, IconChevronArrowRight } from '@components/Icon/IconsList/24';
import Button from '@components/Button';
import Checkbox from '@components/Checkbox';
import { IconCancel24 } from '@components/Icon/IconsList/24';


const EXPANDED_BUTTON_WIDTH = 25;
export const expandedColumns = [
  {
    accessorKey: 'formationNum-0',
    cell: ({ row, getValue }: CellContext<any, string>) => (
      
      <div style={{display: 'flex', alignItems: 'center'}}>
        {row.original.subRows && <Button
          size='s'
          variant='bar'
          onClick={row.getToggleExpandedHandler()}
        >
          {row.getIsExpanded() ? <IconChevronArrowDown /> : <IconChevronArrowRight />}
        </Button>}
        <div style={{paddingLeft: EXPANDED_BUTTON_WIDTH * row.depth}}/>
        {getValue()}
      </div>
    )
  },
  { accessorKey: 'brigadier-0' },
  { accessorKey: 'shift-0' },
  { accessorKey: 'visits-0' },
  { accessorKey: 'status-0' },
  { accessorKey: 'progress-0' }
];

export const columnHelper = createColumnHelper<Formation>();

export const columns = [
  {
    accessorKey: 'formationNum-0',
    header: 'Номер',
    enableColumnFilter: false,
    meta: { textAlign: 'center' },
    cell: () => <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Button size='s'>Button</Button>
    </div>
  },
  { accessorKey: 'brigadier-0', header: 'Бригадир', meta: { borderBottom: false } },
  {
    accessorKey: 'shift-0',
    header: 'Смена',
    cell: () => 
      <div style={{ display: 'flex', justifyContent: 'center', height: '100%', alignItems: 'center' }}>
        <Checkbox />
      </div>
  },
  {
    accessorKey: 'visits-0',
    header: 'Посещения',
    cell: () =>
      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
        <IconCancel24 color='error' />
        <span style={{ marginLeft: 10 }}>Не  разработано</span>
      </div>
  },
  { accessorKey: 'status-0', header: 'Статус' },
  { accessorKey: 'progress-0', header: 'Прогресс' }
];

export const columnsEn = [
  { accessorKey: 'formationNum-0', header: 'FormationNum' },
  { accessorKey: 'brigadier-0', header: 'Brigadier' },
  { accessorKey: 'shift-0', header: 'Shift' },
  { accessorKey: 'visits-0', header: 'Visits' },
  { accessorKey: 'status-0', header: 'Status' },
  { accessorKey: 'progress-0', header: 'Progress' }
];


export const columnGroups: any = [
  columnHelper.group({
    id: 'hello',
    header: () => <span>Первый уровень</span>,
    // footer: props => props.column.id,
    columns: [
      columnHelper.accessor('formationNum-0', {
        header: 'Формировочная',
        footer: props => props.column.id
      }),
      columnHelper.accessor('brigadier-0', {
        header: () => <span>Бригадир</span>,
        footer: props => props.column.id
      })
    ]
  }),
  columnHelper.group({
    header: 'Первый уровень',
    footer: props => props.column.id,
    columns: [
      columnHelper.accessor('shift-0', {
        header: () => 'Смена',
        footer: props => props.column.id
      }),
      columnHelper.group({
        header: 'Второй уровень',
        columns: [
          columnHelper.accessor('visits-0', {
            header: () => <span>Визиты</span>,
            footer: props => props.column.id
          }),
          columnHelper.accessor('status-0', {
            header: 'Статус',
            footer: props => props.column.id
          }),
          columnHelper.accessor('progress-0', {
            header: 'Прогресс',
            footer: props => props.column.id
          })
        ]
      })
    ]
  })
];

export const columnGroupsVirtualization = [
  {
    id: 'zoom',
    header: 'zoom',
    meta: {
      headerStyle: { background: 'rebeccapurple', color: 'white' }
    }
  },
  {
    id: 'left',
    meta: {
      headerStyle: { background: 'linear-gradient(45deg,#F17C58, #E94584, #24AADB , #27DBB1,#FFDC18, #FF3706)', color: 'white' }
    },
    header: () => <span>l Первый уровень</span>,
    columns: [
      {
        id: 'bar',
        header: 'bar',
        meta: {
          headerStyle: { background: '#c887e5' }
        }
      },
      {
        header: 'l Второй уровень left',
        id: 'first_left',
        meta: {
          headerStyle: { background: 'lightblue' }
        },
        columns: [
          {
            accessorKey: 'formationNum-0',
            header: 'l Формировочная'
          },
          {
            accessorKey: 'brigadier-0',
            header: () => <span>l Бригадир</span>
          },
          {
            accessorKey: 'progress-0',
            header: 'l Прогресс'
          }
        ]
      },
      {
        header: '2 Второй уровень left',
        id: 'first_leftx',
        columns: [
          {
            accessorKey: 'shifta',
            header: () => 'l Смена'
          },
          {
            accessorKey: 'visitsa',
            header: () => <span>l Визиты</span>
          },
          {
            accessorKey: 'statusa',
            header: 'l Статус'
          }
        ]
      }
    ]
  },
  {
    header: 'r Первый уровень',
    id: 'right',
    columns: [
      {
        header: 'r Второй уровень',
        id: 'first_right',
        columns: [
          {
            accessorKey: 'shift-0',
            header: () => 'r Смена'
          },
          {
            accessorKey: 'visits-0',
            header: () => <span>r Визиты</span>
          },
          {
            accessorKey: 'status-0',
            header: 'r Статус'
          }
        ]
      },
      {
        header: 'n Второй уровень',
        id: 'first_next',
        columns: [
          {
            accessorKey: 'shiftn',
            header: () => 'n Смена'
          },
          {
            accessorKey: 'visitsn',
            header: () => <span>n Визиты</span>
          },
          {
            accessorKey: 'statusn',
            header: 'n Статус'
          }
        ]
      }
    ]
  }
];