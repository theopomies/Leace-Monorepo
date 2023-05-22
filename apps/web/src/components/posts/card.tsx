/* eslint-disable @next/next/no-img-element */
export interface PostCardProps {
  title: string | null;
  desc: string | null;
  content: string | null;
  income: number | undefined;
  expenses: number | undefined;
}

export const PostCard = ({
  title,
  desc,
  content,
  income,
  expenses,
}: PostCardProps) => {
  return (
    <div className="mx-2 max-w-sm flex-row overflow-hidden rounded-lg border bg-gray-300">
      <img
        src="https://www.gridky.com/blog/wp-content/uploads/2020/07/Comment-acheter-un-immeuble-de-rapport.jpg"
        alt=""
        className="h-80"
      />
      <div className="ml-5 mt-5">
        <div className="mb-2 text-xl font-bold">{title}</div>
        <div className="mb-0.5 text-base text-gray-700">{desc}</div>
        <div className="text-base text-gray-700">{content}</div>
        {income !== undefined ? (
          <div className="text-base text-gray-700">Income: {income}</div>
        ) : (
          <></>
        )}
        {expenses !== undefined ? (
          <div className="text-base text-gray-700">Expenses: {expenses}</div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
