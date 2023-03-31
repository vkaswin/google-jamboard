import { Fragment, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import { toast } from "react-toastify";
import DropDown from "@/components/DropDown";
import Header from "./Header";
import useAuth from "@/hooks/useAuth";
import Pagination from "@/components/Pagination";
import {
  createDocument,
  getDocuments,
  deleteDocument,
} from "@/services/Document";
import { getStaticUrl } from "@/utils";
import { DocumentList as DocumentListType, PageMeta } from "@/types/Document";

import styles from "./DocumentList.module.scss";

const DocumentList = () => {
  const [documents, setDocuments] = useState<DocumentListType[]>([]);

  const [pageMeta, setPageMeta] = useState({} as PageMeta);

  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();

  const navigate = useNavigate();

  const { user, logout } = useAuth();

  let containerRef = useRef<HTMLTableElement>(null);

  const searchParams = new URLSearchParams(location.search);

  let search = searchParams.get("search");
  let page = searchParams.get("page") || 1;

  useEffect(() => {
    getAllDocuments();
  }, [search, page]);

  const getAllDocuments = async () => {
    try {
      let {
        data: { list, pageMeta },
      } = await getDocuments({ limit: 15, search, page: +page });
      setDocuments(list);
      setPageMeta(pageMeta);
    } catch (err: any) {
      toast.error(err?.message);
    } finally {
      if (isLoading) setIsLoading(false);
    }
  };

  const handleCreateDocument = async () => {
    try {
      let {
        data: { data },
      } = await createDocument();
      let documentData = [...documents];
      documentData.unshift({
        _id: data._id,
        title: data.title,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
      setDocuments(documentData);
      navigateToDocument(data._id);
    } catch (err: any) {
      toast.error(err?.message);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!window.confirm("Are you sure to delete this form?")) return;

    try {
      await deleteDocument(documentId);
      let documentData = [...documents];
      let index = documentData.findIndex(({ _id }) => _id === documentId);
      documentData.splice(index, 1);
      setDocuments(documentData);
    } catch (err: any) {
      toast.error(err?.message);
    }
  };

  const handlePageChange = (page: number) => {
    navigate({
      search:
        page !== 0
          ? `?page=${page + 1}${search ? `&search=${search}` : ""}`
          : "",
    });
    if (containerRef.current)
      containerRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const navigateToDocument = (formId: string, newTab: boolean = false) => {
    let path = `/document/${formId}`;
    newTab ? window.open(`#${path}`) : navigate(path);
  };

  return (
    <Fragment>
      <Header search={search} user={user} logout={logout} />
      {isLoading ? (
        <div>
          <span>Loading...</span>
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.document}>
            <table ref={containerRef} className={styles.wrapper}>
              <thead>
                <tr>
                  <th></th>
                  <th>
                    <span>Title</span>
                  </th>
                  <th>
                    <span>Created at</span>
                  </th>
                  <th>
                    <span>Last updated at</span>
                  </th>
                  <th>
                    <span>Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {documents.length === 0 ? (
                  <tr aria-label="empty">
                    <td colSpan={5} align="center">
                      No Records Found
                    </td>
                  </tr>
                ) : (
                  documents.map(({ title, _id, createdAt, updatedAt }) => {
                    return (
                      <Fragment key={_id}>
                        <tr onClick={() => navigateToDocument(_id)}>
                          <td>
                            <img src={getStaticUrl("/logo.png")} />
                          </td>
                          <td>
                            <span>{title}</span>
                          </td>
                          <td>
                            <span>
                              {moment
                                .tz(createdAt, "Asia/Kolkata")
                                .format("MMM D, YYYY")}
                            </span>
                          </td>
                          <td>
                            <span>
                              {moment.tz(updatedAt, "Asia/Kolkata").fromNow()}
                            </span>
                          </td>
                          <td>
                            <div>
                              <i
                                id={`dropdown-${_id}`}
                                className="bx-dots-vertical-rounded"
                                onClick={(e) => e.stopPropagation()}
                              ></i>
                            </div>
                          </td>
                        </tr>
                        <DropDown
                          selector={`#dropdown-${_id}`}
                          placement="bottom"
                          className={styles.dropdown}
                        >
                          <DropDown.Item
                            onClick={() => handleDeleteDocument(_id)}
                          >
                            <i className="bx-trash"></i>
                            <span>Remove</span>
                          </DropDown.Item>
                          <DropDown.Item
                            onClick={() => navigateToDocument(_id, true)}
                          >
                            <i className="bx-link-external"></i>
                            <span>Open in new tab</span>
                          </DropDown.Item>
                        </DropDown>
                      </Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
            {pageMeta.totalPages > 1 && (
              <Pagination pageMeta={pageMeta} onPageChange={handlePageChange} />
            )}
          </div>
          <button className={styles.create_btn} onClick={handleCreateDocument}>
            <img src={getStaticUrl("/plus.svg")} />
          </button>
        </div>
      )}
    </Fragment>
  );
};

export default DocumentList;
