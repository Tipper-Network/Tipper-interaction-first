import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useInfiniteThoughtsComments,
  useThoughtMedia,
  useCreateThoughtComment,
} from "../hooks/thoughts_hooks";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { MessageSquare, X, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ToolTipWrapper } from "@/components/toolTip_Wrapper";
import {
  CreateThoughtCommentSchema,
  type CreateThoughtCommentFormData,
} from "../types/thoughtComment_schema";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  author_name?: string;
}

interface Thought {
  id: string;
  description: string;
  created_at: string;
  comments_count: number;
}

interface ThoughtItemProps {
  thought: Thought;
  onBack: () => void;
  disabled?: boolean;
}

const ThoughtItem: React.FC<ThoughtItemProps> = ({
  thought,
  onBack,
  disabled,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const { data: media } = useThoughtMedia(thought.id);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteThoughtsComments(thought.id);

  const createCommentMutation = useCreateThoughtComment(thought.id);

  const commentForm = useForm<CreateThoughtCommentFormData>({
    resolver: zodResolver(CreateThoughtCommentSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleSubmitComment = async (data: CreateThoughtCommentFormData) => {
    try {
      await createCommentMutation.mutateAsync({ content: data.content });
      commentForm.reset();
    } catch (err) {
      console.error("Failed to create thought comment", err);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const timeAgo = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return new Date(date).toLocaleDateString();
    }
  };

  if (isLoading)
    return (
      <Card className="max-w-3xl mx-auto p-6">
        <p className="text-center text-muted-foreground">Loading comments...</p>
      </Card>
    );
  if (isError)
    return (
      <Card className="max-w-3xl mx-auto p-6">
        <p className="text-center text-destructive">Failed to load comments.</p>
      </Card>
    );

  return (
    <>
      <Card className="max-w-3xl mx-auto shadow-lg border-0 overflow-hidden">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center justify-between">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="hover:bg-gray-100"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to thoughts
          </Button>
        </div>

        {/* Thought Content */}
        <div className="p-6">
          {/* Author Info */}
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src="/assets/icons/Tipper_People_Circle_Ruby.jpg" />
              <AvatarFallback className="bg-secondary text-white">
                {getInitials("Anonymous User")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">Anonymous User</p>
              <p className="text-xs text-muted-foreground">
                {timeAgo(thought.created_at)}
              </p>
            </div>
          </div>

          {/* Thought Description */}
          <p className="text-base leading-relaxed text-foreground mb-4">
            {thought.description}
          </p>

          {/* Thought Media Gallery */}
          {media && media.length > 0 && (
            <div className="mb-4">
              <div
                className={`grid gap-2 ${
                  media.length === 1
                    ? "grid-cols-1"
                    : media.length === 2
                      ? "grid-cols-2"
                      : media.length === 3
                        ? "grid-cols-3"
                        : "grid-cols-2"
                }`}
              >
                {media.map((url: string, index: number) => (
                  <div
                    key={index}
                    className={`relative overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity ${
                      media.length === 3 && index === 0 ? "col-span-2" : ""
                    } ${media.length > 4 && index >= 3 ? "hidden" : ""}`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <Image
                      src={url}
                      alt={`Thought media ${index + 1}`}
                      width={400}
                      height={400}
                      className="w-full h-64 object-cover"
                    />
                    {media.length > 4 && index === 3 && (
                      <div className="absolute inset-0 bg-dark/60 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">
                          +{media.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Comment */}
          <div className="mt-6">
            <FormProvider {...commentForm}>
              <form
                onSubmit={commentForm.handleSubmit(handleSubmitComment)}
                className="space-y-2"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8 mt-1">
                    <AvatarImage src="/avatar.jpg" />
                    <AvatarFallback className="bg-secondary text-white text-xs">
                      {getInitials("You")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <FormField
                      control={commentForm.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            {disabled ? (
                              <strong>
                                What??? you want to comment?
                                <br />
                                without being a Member of this community?
                              </strong>
                            ) : (
                              <Textarea
                                rows={3}
                                placeholder="Write your comment..."
                                className="w-full resize-none"
                                {...field}
                              />
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end mt-2">
                      <ToolTipWrapper
                        className={
                          disabled ? "cursor-not-allowed opacity-50" : ""
                        }
                        tooltipTitle="Join the community to create a thought"
                        variant="clickable"
                      >
                        <Button
                          type="submit"
                          disabled={
                            commentForm.formState.isSubmitting ||
                            createCommentMutation.isPending ||
                            disabled
                          }
                          className="bg-secondary hover:bg-secondary/90"
                        >
                          {commentForm.formState.isSubmitting ||
                          createCommentMutation.isPending
                            ? "Expressing..."
                            : "Express Your Thought"}
                        </Button>
                      </ToolTipWrapper>
                    </div>
                  </div>
                </div>
              </form>
            </FormProvider>
          </div>

          {/* Comments Section */}
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold">
              Comments ({thought.comments_count})
            </h3>

            {data?.pages.map((page, pageIndex) => (
              <React.Fragment key={pageIndex}>
                {page.items.map((comment: Comment) => (
                  <div
                    key={comment.id}
                    className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <Avatar className="w-8 h-8 mt-1">
                      <AvatarImage src="/avatar.jpg" />
                      <AvatarFallback className="bg-secondary text-white text-xs">
                        {getInitials(comment.author_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm">
                          {comment.author_name ?? "Anonymous"}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {timeAgo(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}

            {hasNextPage && (
              <div className="text-center pt-4">
                <Button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  variant="outline"
                  className="w-full"
                >
                  {isFetchingNextPage
                    ? "Loading more..."
                    : "Load More Comments"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Image Lightbox */}
      {selectedImageIndex !== null && media && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setSelectedImageIndex(null)}
        >
          <Button
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2"
            onClick={() => setSelectedImageIndex(null)}
            variant="ghost"
          >
            <X className="w-6 h-6" />
          </Button>

          {selectedImageIndex > 0 && (
            <Button
              className="absolute left-4 text-white hover:bg-white/20 rounded-full p-2"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex(selectedImageIndex - 1);
              }}
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>
          )}

          <div className="max-w-5xl max-h-[90vh] relative">
            <Image
              src={media[selectedImageIndex]}
              alt={`Media ${selectedImageIndex + 1}`}
              width={1200}
              height={800}
              className="max-h-[90vh] w-auto object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
              {selectedImageIndex + 1} / {media.length}
            </div>
          </div>

          {selectedImageIndex < media.length - 1 && (
            <Button
              className="absolute right-4 text-white hover:bg-white/20 rounded-full p-2"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex(selectedImageIndex + 1);
              }}
            >
              <ChevronRight className="w-8 h-8" />
            </Button>
          )}
        </div>
      )}
    </>
  );
};

export default ThoughtItem;
