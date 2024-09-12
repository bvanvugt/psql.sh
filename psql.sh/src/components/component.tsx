'use client';

// import { useEffect, useState } from 'react';

import { useXTerm } from 'react-xtermjs'
// import { neon } from '@neondatabase/serverless';

export default function Component() {

  //   const CONNECTION_STRING = 'postgresql://default_owner:JH4ezKdGsVh7@ep-lingering-glitter-a24ld3do.eu-central-1.aws.neon.tech/default?sslmode=require';

  //   const DT_SQL = `
  // SELECT n.nspname as "Schema",
  //   c.relname as "Name",
  //   CASE c.relkind WHEN 'r' THEN 'table' WHEN 'v' THEN 'view' WHEN 'm' THEN 'materialized view' WHEN 'i' THEN 'index' WHEN 'S' THEN 'sequence' WHEN 's' THEN 'special' WHEN 'f' THEN 'foreign table' WHEN 'p' THEN 'partitioned table' WHEN 'I' THEN 'partitioned index' END as "Type",
  //   pg_catalog.pg_get_userbyid(c.relowner) as "Owner"
  // FROM pg_catalog.pg_class c
  //      LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
  // WHERE c.relkind IN ('r','p','v','m','S','f','')
  //       AND n.nspname <> 'pg_catalog'
  //       AND n.nspname <> 'information_schema'
  //       AND n.nspname !~ '^pg_toast'
  //   AND pg_catalog.pg_table_is_visible(c.oid)
  // ORDER BY 1,2;`;

  const { instance, ref } = useXTerm();

  //   const [isProcessing, setIsProcessing] = useState(false);
  //   const [query, setQuery] = useState('');

  //   useEffect(() => {
  //     async function runQuery() {
  //       setIsProcessing(true);

  //       let actualQuery = query.trim();
  //       if (actualQuery === '\\dt') {
  //         actualQuery = DT_SQL;
  //       }

  //       const sql = neon(CONNECTION_STRING);
  //       sql(actualQuery).then((result) => {
  //         console.log(result);
  //         instance?.writeln('psql> ' + formatTable(result));
  //         instance?.write('psql> ');
  //         setQuery('');
  //         setIsProcessing(false);

  //       }).catch((error) => {
  //         console.error(error);
  //         instance?.writeln('psql> ERROR: ' + error.message);
  //         instance?.write('psql> ');
  //         setQuery('');
  //         setIsProcessing(false);
  //       });
  //     }

  //     instance?.write('psql> ');
  //     instance?.onData((data) => {
  //       if (isProcessing) {
  //         return;
  //       } else if (data.charCodeAt(0) === 127 && query.length > 0) { // 127 is the ASCII code for backspace
  //         if (query.length === 0) {
  //           setQuery('');
  //         } else {
  //           setQuery(query.slice(0, -1));
  //         }
  //         instance?.write('\b \b'); // Handle backspace
  //       } else if (data.charCodeAt(0) === 13) { // 13 is the ASCII code for enter
  //         instance?.writeln(''); // Handle enter
  //         runQuery();
  //       } else {
  //         setQuery(query + data);
  //         instance?.write(data); // Echo data
  //       }
  //     });
  //   }, [ref, instance, isProcessing, query, DT_SQL, CONNECTION_STRING]);



  //   function formatTable(response: any) {
  //     console.log(response);
  //     return JSON.stringify(response);
  //   }

  return (
    <div>
      <div ref={ref} style={{ width: '100%', height: '100%' }} />
      {/* <div>{query}</div> */}
    </div>

  );
}
