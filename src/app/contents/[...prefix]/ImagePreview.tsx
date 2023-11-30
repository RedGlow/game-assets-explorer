"use client";

import { Button } from 'flowbite-react';
import { useCallback, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { MdImageSearch } from 'react-icons/md';

import { Loading } from '@/lib/components/Loading';
import { useBoolean } from '@/lib/use-boolean';

import { createPresignedUrl } from './create-presigned-url';

export function ImagePreview({ fullname }: { fullname: string }) {
  const [working, { setTrue: startWorking, setFalse: stopWorking }] =
    useBoolean(false);
  const [url, setUrl] = useState<string | null>(null);
  const [opened, { setTrue: open, setFalse: close }] = useBoolean(false);

  const onClick = useCallback(() => {
    if (url === null) {
      startWorking();
      createPresignedUrl(fullname)
        .then((u) => {
          setUrl(u);
          open();
        })
        .catch(console.error)
        .finally(stopWorking);
    } else {
      open();
    }
  }, [fullname, open, startWorking, stopWorking, url]);

  const [background, setBackground] = useState(0);
  const onBackgroundClick = useCallback(() => {
    setBackground((background + 1) % 2);
  }, [background]);

  return (
    <span>
      {!working && <MdImageSearch onClick={onClick} />}
      {working && <Loading />}
      {opened && url !== null && (
        <div className="absolute left-0 right-0 top-0 bottom-0 z-20 flex justify-center items-center">
          <div className="bg-black opacity-60 absolute left-0 right-0 top-0 bottom-0" onClick={close}/>
          <div
            className={`${background === 0 ? "bg-white" : "bg-black"} z-30`}
            onClick={onBackgroundClick}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt={fullname} src={url} />
          </div>
          <Button className="absolute right-4 top-4 z-40" onClick={close}>
            <AiOutlineClose />
          </Button>
        </div>
      )}
    </span>
  );
}
