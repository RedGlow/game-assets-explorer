"use client";
import last from 'lodash-es/last';
import { useCallback, useRef, useState } from 'react';
import { HiDownload } from 'react-icons/hi';

import { createPresignedUrl } from '@/lib/actions/create-presigned-url';
import { Loading } from '@/lib/components/Loading';
import { useBoolean } from '@/lib/use-boolean';

export function Download({ fullname }: { fullname: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [working, { setTrue: startWorking, setFalse: stopWorking }] =
    useBoolean(false);
  const anchorRef = useRef<HTMLAnchorElement>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const launchDownload = useCallback(() => {
    if (intervalRef.current !== null) {
      return;
    }
    function clickOn() {
      if (anchorRef.current !== null) {
        anchorRef.current.click();
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        stopWorking();
      }
    }
    intervalRef.current = setInterval(clickOn, 1);
  }, [stopWorking]);

  const onClick = useCallback(() => {
    startWorking();
    if (url === null) {
      createPresignedUrl(fullname)
        .then((u) => {
          setUrl(u);
          launchDownload();
        })
        .catch((err) => {
          console.error(err);
          stopWorking();
        });
    } else {
      launchDownload();
    }
  }, [fullname, launchDownload, startWorking, stopWorking, url]);

  return (
    <>
      {!working && <HiDownload className="mr-2" onClick={onClick} />}
      {working && <Loading />}
      {url && (
        <a
          target="_blank"
          ref={anchorRef}
          href={url}
          className="hidden"
          download={getFilename(fullname)}
        />
      )}
    </>
  );
}

function getFilename(fullname: string) {
  const parts = fullname.split("/").filter((x) => x);
  return last(parts);
}
