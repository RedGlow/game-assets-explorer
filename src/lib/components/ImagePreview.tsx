"use client";

import { Button } from 'flowbite-react';
import { useCallback, useRef, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { MdImageSearch } from 'react-icons/md';

import { createPresignedUrl } from '@/lib/actions/create-presigned-url';
import { Loading } from '@/lib/components/Loading';
import { useBoolean } from '@/lib/use-boolean';

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
          setImageZoom(1);
          open();
        })
        .catch(console.error)
        .finally(stopWorking);
    } else {
      setImageZoom(1);
      open();
    }
  }, [fullname, open, startWorking, stopWorking, url]);

  const [background, setBackground] = useState(0);
  const onBackgroundClick = useCallback(() => {
    setBackground((background + 1) % 2);
  }, [background]);

  // must attach event like this because onWheel is a passive event, and as such cannot be prevented
  const [imageZoom, setImageZoom] = useState(1.0);
  const listenerData = useRef<(() => void) | null>(null);
  const onImgRef = (img: HTMLImageElement) => {
    if (img) {
      const handler = (ev: WheelEvent) => {
        setImageZoom((z) => Math.max(0.5, Math.min(3, z - ev.deltaY / 1000)));
        ev.preventDefault();
      };
      img.addEventListener("wheel", handler);
      listenerData.current = () => {
        img.removeEventListener("wheel", handler);
      };
    } else if (listenerData.current !== null) {
      listenerData.current();
      listenerData.current = null;
    }
  };

  return (
    <span>
      {!working && <MdImageSearch onClick={onClick} />}
      {working && <Loading />}
      {opened && url !== null && (
        <div className="fixed left-0 right-0 top-0 bottom-0 z-20 flex justify-center items-center">
          <div
            className="bg-black opacity-60 absolute left-0 right-0 top-0 bottom-0"
            onClick={close}
          />
          <div
            className={`${background === 0 ? "bg-white" : "bg-black"} z-30`}
            onClick={onBackgroundClick}
            style={{ transform: `scale(${imageZoom})` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt={fullname} src={url} ref={onImgRef} />
          </div>
          <Button className="absolute right-4 top-4 z-40" onClick={close}>
            <AiOutlineClose />
          </Button>
        </div>
      )}
    </span>
  );
}
