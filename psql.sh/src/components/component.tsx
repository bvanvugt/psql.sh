'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { useXTerm } from 'react-xtermjs'
import { neon } from '@neondatabase/serverless';
import { FitAddon } from '@xterm/addon-fit';

import neonLogo from './neon.svg';

export default function Component() {

  const CONNECTION_STRING = 'postgresql://default_owner:JH4ezKdGsVh7@ep-lingering-glitter-a24ld3do.eu-central-1.aws.neon.tech/default?sslmode=require';

  const DT_SQL = `
  SELECT n.nspname as "Schema",
    c.relname as "Name",
    CASE c.relkind WHEN 'r' THEN 'table' WHEN 'v' THEN 'view' WHEN 'm' THEN 'materialized view' WHEN 'i' THEN 'index' WHEN 'S' THEN 'sequence' WHEN 's' THEN 'special' WHEN 'f' THEN 'foreign table' WHEN 'p' THEN 'partitioned table' WHEN 'I' THEN 'partitioned index' END as "Type",
    pg_catalog.pg_get_userbyid(c.relowner) as "Owner"
  FROM pg_catalog.pg_class c
       LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
  WHERE c.relkind IN ('r','p','v','m','S','f','')
        AND n.nspname <> 'pg_catalog'
        AND n.nspname <> 'information_schema'
        AND n.nspname !~ '^pg_toast'
    AND pg_catalog.pg_table_is_visible(c.oid)
  ORDER BY 1,2;`;

  const { instance, ref } = useXTerm();
  const buffer = useRef(''); // Buffer to store current command
  const isProcessing = useRef(false); // Flag to indicate if a command is currently being processed

  const [isQuit, setIsQuit] = useState(false);


  function formatTable(data: any) {
    if (!Array.isArray(data) || data.length === 0) {
      return 'No data available.';
    }

    // Extract the columns from the first item in the data array
    const columns = Object.keys(data[0]);

    // Determine the maximum width for each column
    const columnWidths = columns.map(column => {
      return Math.max(
        ...data.map(row => String(row[column]).length),
        column.length
      );
    });

    // Helper function to format a row
    const formatHeaderRow = (row: any) => {
      return columns.map((column, i) => {
        const cell = ' ' + String(row[i] || ''); // Handle missing values
        return cell.padEnd(columnWidths[i] + 2); // Pad with spaces
      }).join('|');
    };

    // Helper function to format a row
    const formatRow = (row: any) => {
      return columns.map((column, i) => {
        const cell = ' ' + String(row[column] || ''); // Handle missing values
        return cell.padEnd(columnWidths[i] + 2); // Pad with spaces
      }).join('|');
    };

    // Create the table header
    const header = formatHeaderRow(columns);
    const separator = columnWidths.map(width => '-'.repeat(width + 2)).join('+');

    // Format the rows
    const formattedRows = data.map(formatRow).join('\r\n');

    // Combine header, separator, and rows into a single table string
    return [header, separator, formattedRows].join('\r\n') + `\r\n(${data.length} row${data.length > 1 ? 's' : ''})\r\n`;
  }

  async function runQuery() {
    isProcessing.current = true;

    let actualQuery = buffer.current.trim();
    if (actualQuery === '\\dt') {
      actualQuery = DT_SQL;
    }

    const sql = neon(CONNECTION_STRING);
    sql(actualQuery).then((result) => {
      instance?.writeln('\r\n' + formatTable(result) + '\r\n');
      instance?.write('neondb=> ');
      buffer.current = '';
      isProcessing.current = false;

    }).catch((error) => {
      console.error(error);
      instance?.writeln('neondb=> ERROR: ' + error.message);
      instance?.write('neondb=> ');
      buffer.current = '';
      isProcessing.current = false;
    });
  }

  function onData(data: any) {
    if (isProcessing.current) {
      return;
    }

    if (data.charCodeAt(0) === 127 && buffer.current.length > 0) { // 127 is the ASCII code for backspace
      if (buffer.current.length === 1) {
        buffer.current = '';
      } else {
        buffer.current = buffer.current.slice(0, -1);
      }
      instance?.write('\b \b'); // Handle backspace
    } else if (data.charCodeAt(0) === 13) { // 13 is the ASCII code for enter
      instance?.writeln(''); // Handle enter
      if (buffer.current.trim().length > 0) {
        if (buffer.current.trim() === '\\q') {
          setIsQuit(true);
        } else {
          runQuery();
        }
      } else {
        instance?.write('neondb=> ');
      }
    } else {
      buffer.current = buffer.current + data;
      instance?.write(data); // Echo data
    }
  }

  useEffect(() => {
    const fitaddon = new FitAddon();
    instance?.loadAddon(fitaddon);
    fitaddon.fit();

    instance?.writeln('Welcome to Neon! Creating database...');
    instance?.writeln('');
    instance?.writeln('psql (16.4)');
    instance?.writeln('SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, compression: off');
    instance?.writeln('Type "help" for help.');
    instance?.writeln('');
    instance?.write('neondb=> ');
    instance?.onData(onData);
  }, [ref, instance]);

  return (
    <div className='w-full h-full'>
      {!isQuit && <div ref={ref} className='w-full h-full' />}
      {isQuit &&
        <div className="w-full h-full flex flex-col gap-8 justify-center items-center">
          <Image
            src={neonLogo}
            width={250}
            alt="neon logo"
          />
          <p>
            Get started at <a className="text-neutral-500" href="https://neon.tech">neon.tech</a>.
          </p>
        </div>}
    </div>
  );
}
