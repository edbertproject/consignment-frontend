import { PaymentMethodInstruction } from '@/types';
import { useTranslation } from 'next-i18next';
import cn from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { MinusIcon } from '@/components/icons/minus-icon';
import { PlusIcon } from '@/components/icons/plus-icon';
import { heightCollapse } from '@/lib/motion/height-collapse';
import { ReactNode, useState } from 'react';

type CollapseProps = {
  i: number;
  title: string;
  content: ReactNode;
  expanded: number;
  setExpanded: any;
};

const Collapse: React.FC<CollapseProps> = ({
  i,
  expanded,
  setExpanded,
  title,
  content,
}) => {
  const isOpen = i === expanded;
  const activeClass = isOpen ? 'shadow-sm' : '';

  const { t } = useTranslation('common');

  return (
    <div
      className={cn(
        'mb-2.5 rounded border border-solid border-border-200 bg-light transition-all hover:border-border-base',
        activeClass
      )}
    >
      <motion.header
        initial={false}
        onClick={() => setExpanded(isOpen ? false : i)}
        className="flex cursor-pointer items-center justify-between rounded py-4 px-5 transition-colors"
      >
        <h2 className="text-sm font-semibold leading-relaxed text-heading md:text-base">
          {t(title)}
        </h2>
        {isOpen ? (
          <MinusIcon
            className="flex-shrink-0 stroke-2"
            width={18}
            height={18}
          />
        ) : (
          <PlusIcon className="flex-shrink-0 stroke-2" width={20} height={20} />
        )}
      </motion.header>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="from"
            animate="to"
            exit="from"
            variants={heightCollapse()}
          >
            <div className="px-5 pb-4 text-sm leading-7 text-body-dark md:pt-1 md:text-base md:leading-loose">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const HowToPayModal = ({ data }: { data: PaymentMethodInstruction[] }) => {
  const [expanded, setExpanded] = useState<number>(0);
  const { t } = useTranslation('common');

  return (
    <div className="w-[95vw] max-w-lg rounded-md bg-white p-8">
      <h3 className="mb-2 text-center text-2xl font-semibold text-heading">
        {t('text-how-to-pay')}
      </h3>
      <div className="mb-8">
        {data.map(({ title, instructions }, index) => (
          <Collapse
            i={index}
            key={title}
            title={title}
            content={
              <ol className="ml-4 list-decimal">
                {instructions.map((instruction, index) => {
                  return <li key={index}>{instruction}</li>;
                })}
              </ol>
            }
            expanded={expanded}
            setExpanded={setExpanded}
          />
        ))}
      </div>
    </div>
  );
};

export default HowToPayModal;
